import { randomUUID } from 'node:crypto';
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
        if (await this.accountService.has_account(account.email))
            throw new BadRequestException('User alredy has an account');
        const new_user = await this.accountService.create(account);
        const new_token = this.generateRefreshToken();
        await this.saveRefreshToken({ token: new_token, email: new_user.email });
        const payload = {
            sub: new_user.id_user,
            email: new_user.email,
            jti: randomUUID()
        };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: new_token,
        };
    }

    async login(user_login: LoginDTO): Promise<TokensInterface> {
        const user = await this.validateUser(user_login.email, user_login.password);
        if (!user)
            throw new UnauthorizedException('Invalid Credentials');
        const new_token = this.generateRefreshToken();
        await this.saveRefreshToken({ token: new_token, email: user.email });
        const payload = {
            sub: user.id_user,
            email: user.email,
            jti: randomUUID()
        }
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: new_token,
        }
    }

    async refresh(token: string): Promise<TokensInterface> {
        const actual_token = await this.getRefreshToken(token);
        if (!actual_token)
            throw new NotFoundException('Refresh token does not exists');
        await this.logout(token);
        const new_token = this.generateRefreshToken();
        await this.saveRefreshToken({ token: new_token, email: actual_token.email });
        const account = await this.accountService.get_by_email(actual_token.email);

        const payload = {
            sub: account.id_user,
            email: actual_token.email,
            jti: randomUUID()
        };

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: new_token
        };
    }

    async logout(refreshToken: string): Promise<void> {
        const token = await this.getRefreshToken(refreshToken);
        await this.refreshTokenRepo.update({ id_token: token.id_token }, { revoked: true });
    }

    private generateRefreshToken(): string {
        return randomUUID() + randomUUID();
    }

    async saveRefreshToken(token: RefreshTokenSaveDTO): Promise<RefreshTokenEntity> {
        const new_register = this.refreshTokenRepo.create({
            email: token.email,
            token_hash: token.token
        });
        const stored = await this.refreshTokenRepo.save(new_register);
        if (!stored)
            throw new InternalServerErrorException('Error saving token');
        return stored;
    }

    getEmail(token: string) {
        const payload: jwt_payload = this.jwtService.verify(token);
        return payload.email;
    }
}
