import { createHash, randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { jwt_payload, RefreshTokenSaveDTO } from './auth.dto';
import { TokensInterface } from './auth.dto';
import { AccountsService } from 'src/entities/accounts/accounts.service';
import { AccountsEntity } from 'src/entities/accounts/accounts.entity';
import { AccountCreateDTO, LoginDTO } from 'src/entities/accounts/accounts.dto';
import { UsersService } from 'src/entities/users/users.service';


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
        private readonly accountService: AccountsService,
        private readonly userService: UsersService
    ) { }

    async validateUser(email: string, passwd: string): Promise<AccountsEntity> {
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
        if (!tokenHashed)
            throw new BadRequestException('Token is empty');
        const storedToken = await this.refreshTokenRepo.findOneBy({ token_hash: tokenHashed });
        if (!storedToken)
            throw new NotFoundException('Token not found');
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
        const partner = this.userService.get_by_user_id(account.id_user);
        if (!partner)
            throw new NotFoundException('User is not cecit partner');
        if (await this.accountService.has_account(account.email))
            throw new BadRequestException('User alredy has an account');
        const newUser = await this.accountService.create(account);
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
        const actualToken = await this.getRefreshToken(this.hashToken(token));
        if (!actualToken) {
            throw new NotFoundException('Refresh token does not exists');
        }
        if (!(await this.validateRefreshToken(actualToken))) {
            await this.refreshTokenRepo.delete({ id_token: actualToken.id_token });
            throw new UnauthorizedException('Invalid token');
        }

        const newToken = this.generateRefreshToken();
        actualToken.change_token(newToken);
        await this.refreshTokenRepo.save(actualToken);
        const account = await this.accountService.get_by_email(actualToken.email);

        const payload: jwt_payload = {
            sub: account.id_user,
            email: actualToken.email,
            role: account.role,
            jti: randomUUID()
        };

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: newToken
        };
    }

    async logout(refreshToken: string): Promise<void> {
        const token = await this.getRefreshToken(refreshToken);
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
