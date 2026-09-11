import { createHash, randomUUID } from 'node:crypto';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { LessThan, Repository } from 'typeorm';
import { type jwt_payload, RefreshResult, RefreshTokenSaveDTO } from './auth.dto';
import { TokensInterface } from './auth.dto';
import { AccountsService } from 'src/entities/accounts/accounts.service';
import { AccountsEntity } from 'src/entities/accounts/accounts.entity';
import {
    AccountCreateDTO,
    AccountRole,
    LoginDTO,
} from 'src/entities/accounts/accounts.dto';
import { UsersService } from 'src/entities/users/users.service';
import { PartnersService } from 'src/entities/partners/partners.service';
import { PartnersAdminsService } from 'src/entities/partnersadmins/partnersadmins.service';
import { Cron, CronExpression } from '@nestjs/schedule';

const DEFAULT_REFRESH_DAYS = 7;

// Ventana en la que el refresh token anterior sigue aceptándose después de
// rotar. Cubre navegaciones concurrentes sin abrir una ventana útil a un
// atacante (el token viejo no extiende su vigencia, solo se acorta a esto).
const REFRESH_GRACE_MS = 60_000;

export function getRefreshDays(): number {
    return Number(process.env.REFRESH_TOKEN_EXPIRES) || DEFAULT_REFRESH_DAYS;
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly partnersService: PartnersService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
        private readonly accountService: AccountsService,
        private readonly userService: UsersService,
        private readonly partnersAdminsService: PartnersAdminsService,
    ) { }

    async validateUser(email: string, passwd: string): Promise<AccountsEntity> {
        this.logger.debug(`Validating user: ${email}`);
        const user = await this.accountService.get_by_email(email);

        if (!user?.password)
            throw new UnauthorizedException('Invalid credentials');

        const passwordValid = await verify(user.password, passwd);

        if (!passwordValid)
            throw new UnauthorizedException('Invalid credentials');
        return user;
    }

    private hashToken(token: string): string {
        if (!token) return '';
        return createHash('sha256').update(token).digest('hex');
    }

    private async getRefreshToken(
        tokenHashed: string,
    ): Promise<RefreshTokenEntity> {
        if (!tokenHashed) {
            this.logger.debug('Token empty');
            throw new BadRequestException('Token is empty');
        }
        const storedToken = await this.refreshTokenRepo.findOneBy({
            token_hash: tokenHashed,
        });
        if (!storedToken) {
            this.logger.debug(`Token ${tokenHashed} does not exists`);
            throw new NotFoundException('Token not found');
        }
        return storedToken;
    }

    async validateRefreshToken(token: RefreshTokenEntity): Promise<boolean> {
        if (token.revoked) {
            throw new UnauthorizedException('Refresh token revoked');
        }
        const expires_at: Date = new Date(token.expires_at);
        if (expires_at.getTime() <= Date.now()) {
            throw new UnauthorizedException('Refresh token expired');
        }
        return true;
    }
    async register(account: AccountCreateDTO): Promise<TokensInterface> {
        this.logger.log(`Registering new account: ${account.email}`);
        const partner = await this.userService.get_by_user_id(account.id_user);
        if (!partner) throw new NotFoundException('User is not cecit partner');
        if (await this.accountService.has_account(account.email))
            throw new BadRequestException('User alredy has an account');

        const ownedPartner = await this.partnersService.getByOwnerId(
            account.id_user,
        );
        const newUser = await this.accountService.create({
            ...account,
            role: ownedPartner ? AccountRole.PARTNER_ADMIN : AccountRole.USER,
        });

        if (ownedPartner) {
            await this.partnersAdminsService.createByOwner(
                newUser.id_user,
                ownedPartner.id_partner,
            );
        }
        const newToken = this.generateRefreshToken();
        await this.saveRefreshToken({ token: newToken, email: newUser.email });
        const payload = {
            sub: newUser.id_user,
            email: newUser.email,
            role: newUser.role,
            jti: randomUUID(),
        };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: newToken,
        };
    }

    async login(userLogin: LoginDTO): Promise<TokensInterface> {
        this.logger.log(`Login attempt: ${userLogin.email}`);
        const user = await this.validateUser(userLogin.email, userLogin.password);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const newToken = this.generateRefreshToken();
        await this.saveRefreshToken({ token: newToken, email: user.email });
        const payload = {
            sub: user.id_user,
            email: user.email,
            role: user.role,
            jti: randomUUID(),
        };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: newToken,
        };
    }

    async refresh(token: string): Promise<RefreshResult> {
        const actualToken = await this.getRefreshToken(this.hashToken(token));

        try {
            await this.validateRefreshToken(actualToken);
        } catch {
            // Token vencido o revocado: se elimina y se rechaza.
            await this.refreshTokenRepo.delete({ id_token: actualToken.id_token });
            throw new UnauthorizedException('Invalid token');
        }

        const newToken = this.generateRefreshToken();
        await this.saveRefreshToken({ token: newToken, email: actualToken.email });

        // Retiro con gracia: el token anterior sigue válido por
        // REFRESH_GRACE_MS para que los refresh concurrentes (el layout del
        // frontend refresca en cada navegación) no fallen con "Token not
        // found". Solo se acorta la vigencia, nunca se extiende.
        const remaining = new Date(actualToken.expires_at).getTime() - Date.now();
        if (remaining > REFRESH_GRACE_MS) {
            actualToken.expires_at = new Date(Date.now() + REFRESH_GRACE_MS);
            await this.refreshTokenRepo.save(actualToken);
        }

        // Limpieza oportunista de tokens vencidos de este email.
        await this.refreshTokenRepo
            .delete({ email: actualToken.email, expires_at: LessThan(new Date()) })
            .catch(() => undefined);

        const account = await this.accountService.get_by_email(actualToken.email);
        if (!account) throw new UnauthorizedException('Invalid token');

        const payload: jwt_payload = {
            sub: account.id_user,
            email: actualToken.email,
            role: account.role,
            jti: randomUUID(),
        };

        this.logger.log(
            `Refresh token ${payload.jti} generated to ${actualToken.email}`,
        );
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: newToken,
            // Mismo shape que GET /auth/profile (JwtStrategy.validate).
            profile: {
                user_id: account.id_user,
                email: account.email,
                role: account.role,
            },
        };
    }

    async logout(refreshToken: string): Promise<void> {
        // Logout idempotente: si no hay token o ya no existe, igual se
        // considera éxito para no romper el flujo del cliente.
        if (!refreshToken) return;
        this.logger.log('Logging out user');
        await this.refreshTokenRepo.delete({ token_hash: this.hashToken(refreshToken) });
    }

    @Cron(CronExpression.EVERY_DAY_AT_3AM)
    async purgeExpiredRefreshTokens(): Promise<void> {
        await this.refreshTokenRepo.delete({ expires_at: LessThan(new Date()) });
    }

    private generateRefreshToken(): string {
        return randomUUID() + '-' + randomUUID();
    }

    async saveRefreshToken(token: RefreshTokenSaveDTO): Promise<RefreshTokenEntity> {
        const newRegister = this.refreshTokenRepo.create({
            email: token.email,
            token_hash: token.token,
        });
        const stored = await this.refreshTokenRepo.save(newRegister);
        if (!stored) throw new InternalServerErrorException('Error saving token');
        return stored;
    }

    getEmail(token: string) {
        const payload: jwt_payload = this.jwtService.verify(token);
        return payload.email;
    }

    async updatePasswd(id_user: string, new_password: string): Promise<boolean> {
        const result = await this.accountService.update({
            id_user: id_user,
            password: new_password
        });
        if (!result)
            throw new InternalServerErrorException('Error changing email');
        return true;
    }

    async updateEmail(id_user: string, actual_email: string, new_email: string): Promise<boolean> {
        // Borrar los refresh tokens asociados
        await this.refreshTokenRepo.delete({
            email: actual_email
        });

        const result = await this.accountService.update({
            id_user: id_user,
            email: new_email
        });
        if (!result)
            throw new InternalServerErrorException('Error changing email');
        return true;
    }
}
