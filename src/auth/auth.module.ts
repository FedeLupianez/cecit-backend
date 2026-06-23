import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { ConsumerModule } from 'src/consumer/consumer.module';


@Module({
    imports: [PassportModule, JwtModule.register({
        secret: process.env.JWT_SECRET || 'secret',
        signOptions: { expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as `${number}${'s' | 'm' | 'h' | 'd'}` }
    }),
        TypeOrmModule.forFeature([RefreshTokenEntity]),
        ConsumerModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule { }
