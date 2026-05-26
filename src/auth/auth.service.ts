import { randomUUID } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/entities/users/users.service';
import { UserLoginDTO } from 'src/entities/users/users.dto';
import { hash, verify } from 'argon2';
import { type UsersEntity } from 'src/entities/users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import type { RefreshTokenDTO } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
    ) { }

    async validateUser(email: string, passwd: string): Promise<UsersEntity | null> {
        const user = await this.userService.get_by_email(email);

        if (!user)
            return null;

        const passwordValid = await verify(user.password, passwd);

        if (!passwordValid)
            return null;
        return user;
    }

    async login(user_login: UserLoginDTO): Promise<Record<string, string>> {
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
            refresh_token: await this.generateRefreshToken(user.id_user),
        }
    }

    async refresh(refreshDto: RefreshTokenDTO): Promise<Record<string, string>> {
        const tokenHash = await hash(refreshDto.refresh_token);

        const stored = await this.refreshTokenRepo.findOne({
            where: { token_hash: tokenHash, revoked: false }
        });

        if (!stored || stored.expires_at < new Date()) {
            if (stored) {
                await this.refreshTokenRepo.update(stored.id, { revoked: true });
            }
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        await this.refreshTokenRepo.update(stored.id, { revoked: true });

        const payload = {
            sub: stored.user_id,
            email: (await this.userService.get_by_user_id(stored.user_id)).email,
            jti: randomUUID()
        };

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: await this.generateRefreshToken(stored.user_id),
        };
    }

    async logout(refreshToken: string): Promise<void> {
        const tokenHash = await hash(refreshToken);
        await this.refreshTokenRepo.update({ token_hash: tokenHash }, { revoked: true });
    }

    private async generateRefreshToken(userId: string): Promise<string> {
        const token = randomUUID() + randomUUID();
        const tokenHash = await hash(token);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.refreshTokenRepo.save({
            token_hash: tokenHash,
            user_id: userId,
            expires_at: expiresAt,
        });

        return token;
    }
}
