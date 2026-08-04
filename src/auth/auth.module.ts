import { Global, forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { AccountsModule } from 'src/entities/accounts/accounts.module';
import { UsersModule } from 'src/entities/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PartnersEntity } from 'src/entities/partners/partners.entity';
import { PartnersAdminsEntity } from 'src/entities/partnersadmins/partnersadmins.entity';

@Global()
@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET') || 'secret',
            signOptions: { expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m') as `${number}${'s' | 'm' | 'h' | 'd'}` }
        })
    }),
    TypeOrmModule.forFeature([RefreshTokenEntity,]),
        AccountsModule,
    forwardRef(() => UsersModule)
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [PassportModule, JwtStrategy]
})
export class AuthModule { }
