import { createHash, randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { type jwt_payload, RefreshTokenSaveDTO } from './auth.dto';
import { TokensInterface } from './auth.dto';
import { AccountsService } from 'src/entities/accounts/accounts.service';
import { AccountsEntity } from 'src/entities/accounts/accounts.entity';
import { AccountCreateDTO, AccountRole, LoginDTO } from 'src/entities/accounts/accounts.dto';
import { UsersService } from 'src/entities/users/users.service';
import { PartnersEntity } from 'src/entities/partners/partners.entity';
import { PartnersService } from 'src/entities/partners/partners.service';
import { PartnersAdminsEntity } from 'src/entities/partnersadmins/partnersadmins.entity';



@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly PartnersService: PartnersService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
        private readonly accountService: AccountsService,
        private readonly userService: UsersService,
        @InjectRepository(PartnersEntity)
        private readonly partnersRepository: Repository<PartnersEntity>,
        @InjectRepository(PartnersAdminsEntity)
        private readonly partnersAdminsRepository: Repository<PartnersAdminsEntity>,
    ) { }

    async validateUser(email: string, passwd: string): Promise<AccountsEntity> {
        this.logger.debug(`Validating user: ${email}`);
        const user = await this.accountService.get_by_email(email);

        const passwordValid = await verify(user.password, passwd);

        if (!passwordValid)
            throw new BadRequestException('Password does not match')
        return user;
    }

    private hashToken(token: string): string {
        if (!token)
            return ""
        return createHash('sha256').update(token).digest('hex');
    }

    private async getRefreshToken(tokenHashed: string): Promise<RefreshTokenEntity> {
        if (!tokenHashed) {
            this.logger.debug('Token empty');
            throw new BadRequestException('Token is empty');
        }
        const storedToken = await this.refreshTokenRepo.findOneBy({ token_hash: tokenHashed });
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
        const partner = this.userService.get_by_user_id(account.id_user);
        if (!partner)
            throw new NotFoundException('User is not cecit partner');
        if (await this.accountService.has_account(account.email))
            throw new BadRequestException('User alredy has an account');

        const ownedPartner = await this.PartnersService.getByOwnerId(account.id_user);
        const newUser = await this.accountService.create(account);

        if (ownedPartner)
            newUser.role = AccountRole.PARTNER_ADMIN;

        if (ownedPartner) {
            const partnerAdmin = new PartnersAdminsEntity();
            partnerAdmin.id_user = newUser.id_user;
            partnerAdmin.id_partner = ownedPartner.id_partner;
            await this.partnersAdminsRepository.save(partnerAdmin);
        }
        const newToken = this.generateRefreshToken();
        await this.saveRefreshToken({ token: newToken, email: newUser.email });
        const payload = {
            sub: newUser.id_user,
            email: newUser.email,
            jti: randomUUID()
        };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: newToken,
        };
    }

    async login(userLogin: LoginDTO): Promise<TokensInterface> {
        this.logger.log(`Login attempt: ${userLogin.email}`);
        const user = await this.validateUser(userLogin.email, userLogin.password);
        if (!user)
            throw new UnauthorizedException('Invalid Credentials');
        const newToken = this.generateRefreshToken();
        await this.saveRefreshToken({ token: newToken, email: user.email });
        const payload = {
            sub: user.id_user,
            email: user.email,
            jti: randomUUID()
        }
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: newToken,
        }
    }

    async refresh(token: string): Promise<TokensInterface> {
        this.logger.debug(`Refreshing token ${token}`);
        const actualToken = await this.getRefreshToken(this.hashToken(token));

        if (!(await this.validateRefreshToken(actualToken))) {
            await this.refreshTokenRepo.delete({ id_token: actualToken.id_token });
            this.logger.debug('Invalid Refresh Token')
            throw new UnauthorizedException('Invalid token');
        }

        const newToken = this.generateRefreshToken();
        await actualToken.change_token(newToken);
        await this.refreshTokenRepo.save(actualToken);
        const account = await this.accountService.get_by_email(actualToken.email);

        const payload: jwt_payload = {
            sub: account.id_user,
            email: actualToken.email,
            role: account.role,
            jti: randomUUID()
        };

        this.logger.log(`Refresh token ${payload.jti} generated to ${actualToken.email}`)
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: newToken
        };
    }

    async logout(refreshToken: string): Promise<void> {
        this.logger.log('Logging out user');
        const token = await this.getRefreshToken(this.hashToken(refreshToken));
        await this.refreshTokenRepo.delete({ id_token: token.id_token });
    }

    private generateRefreshToken(): string {
        return randomUUID() + randomUUID();
    }

    async saveRefreshToken(token: RefreshTokenSaveDTO): Promise<RefreshTokenEntity> {
        const newRegister = this.refreshTokenRepo.create({
            email: token.email,
            token_hash: token.token
        });
        const stored = await this.refreshTokenRepo.save(newRegister);
        if (!stored)
            throw new InternalServerErrorException('Error saving token');
        return stored;
    }

    getEmail(token: string) {
        const payload: jwt_payload = this.jwtService.verify(token);
        return payload.email;
    }
}
