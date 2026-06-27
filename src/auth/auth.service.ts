import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { type RefreshTokenDTO } from './auth.dto';
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

    private async getRefreshToken(tokenHashed: string): Promise<RefreshTokenEntity> {
        if (!tokenHashed)
            throw new BadRequestException('Token is empty');
        const storedTokens = await this.refreshTokenRepo.find();
        for (const stored of storedTokens) {
            const match = await verify(stored.token_hash, tokenHashed);
            if (match)
                return stored;
        }
        throw new NotFoundException('Token not found');
    }

    async validateRefreshToken(token: string): Promise<boolean> {
        const storedToken = await this.getRefreshToken(token);
        if (storedToken.revoked) {
            throw new UnauthorizedException('Refresh token revoked');
        }
        const expires_at: Date = new Date(storedToken.expires_at);
        if (expires_at.getTime() <= Date.now()) {
            throw new UnauthorizedException('Refresh token expired');
        }
        return true;
    }

    async register(account: AccountCreateDTO): Promise<TokensInterface> {
        const partner = this.userService.get_by_user_id(account.id_user);
        if (!partner)
            throw new NotFoundException('User is not cecit partner');
        const new_user = await this.accountService.create(account);
        const payload = {
            sub: new_user.id_user,
            email: new_user.email,
            jti: randomUUID()
        };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: await this.generateRefreshToken(),
        };
    }

    async login(user_login: LoginDTO): Promise<TokensInterface> {
        const user = await this.validateUser(user_login.email, user_login.password);
        if (!user)
            throw new UnauthorizedException('Invalid Credentials');

        const payload = {
            sub: user.id_user,
            email: user.email,
            jti: randomUUID()
        }
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: await this.generateRefreshToken(),
        }
    }

    async refresh(refreshDto: RefreshTokenDTO): Promise<TokensInterface> {
        const storedToken = await this.getRefreshToken(refreshDto.refresh_token);
        await this.refreshTokenRepo.update(storedToken.id_token, { revoked: true });
        const payload = {
            sub: refreshDto.id_user,
            email: (await this.accountService.get_by_id(refreshDto.id_user)).email,
            jti: randomUUID()
        };

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: await this.generateRefreshToken(),
        };
    }

    async logout(refreshToken: string): Promise<void> {
        const tokenHash = await hash(refreshToken);
        await this.refreshTokenRepo.update({ token_hash: tokenHash }, { revoked: true });
    }

    private async generateRefreshToken(): Promise<string> {
        const token = randomUUID() + randomUUID();
        const tokenHash = await hash(token);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.refreshTokenRepo.save({
            token_hash: tokenHash,
            expires_at: expiresAt,
        });

        return token;
    }
}
