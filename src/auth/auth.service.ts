import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserLoginDTO } from 'src/entities/users/users.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { RegisterDTO, type RefreshTokenDTO } from './auth.dto';
import { ConsumerService } from 'src/consumer/consumer.service';
import type { Consumer } from 'src/consumer/consumer.dto';

export interface TokensInterface {
    access_token: string;
    refresh_token: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly consumerService: ConsumerService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
    ) { }

    async validateUser(email: string, passwd: string): Promise<Consumer> {
        const user = await this.consumerService.get_consumer({ email: email })

        const passwordValid = await verify(user.password, passwd);

        if (!passwordValid)
            throw new BadRequestException('Password does not match')
        return user;
    }

    async validateRefreshToken(token: string): Promise<boolean> {
        const hashed = await hash(token);
        const stored = await this.refreshTokenRepo.findOneBy({ token_hash: hashed });
        if (!stored) {
            throw new NotFoundException('Refresh token not found');
        }
        if (stored.revoked) {
            throw new UnauthorizedException('Refresh token revoked');
        }
        const expires_at: Date = new Date(stored.expires_at);
        if (expires_at.getTime() <= Date.now()) {
            throw new UnauthorizedException('Refresh token expired');
        }
        return true;
    }

    async register(user: RegisterDTO): Promise<TokensInterface> {
        const new_user = await this.consumerService.create(user.user_type, user.data);
        const payload = {
            sub: new_user.id_consumer,
            email: new_user.email,
            jti: randomUUID()
        };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: await this.generateRefreshToken(),
        };
    }

    async login(user_login: UserLoginDTO): Promise<TokensInterface> {
        const user = await this.validateUser(user_login.email, user_login.password);
        if (!user)
            throw new UnauthorizedException('Invalid Credentials');

        const payload = {
            sub: user.id_consumer,
            email: user.email,
            jti: randomUUID()
        }
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: await this.generateRefreshToken(),
        }
    }

    async refresh(refreshDto: RefreshTokenDTO): Promise<TokensInterface> {
        const tokenHash = await hash(refreshDto.refresh_token);

        const stored = await this.refreshTokenRepo.findOne({
            where: { token_hash: tokenHash, revoked: false }
        });
        if (!stored)
            throw new UnauthorizedException('Invalid refresh token');

        await this.refreshTokenRepo.update(stored.id_token, { revoked: true });

        const payload = {
            sub: refreshDto.id_user,
            email: (await this.consumerService.get_consumer({ email: refreshDto.id_user })).email,
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
