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
import { PartnersModule } from 'src/entities/partners/partners.module';
import { PartnersAdminsModule } from 'src/entities/partnersadmins/partnersadmins.module';
import { CecitAdminGuard } from './cecitadmin.guard';

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
    TypeOrmModule.forFeature([RefreshTokenEntity]),
        AccountsModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PartnersModule),
    PartnersAdminsModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, CecitAdminGuard],
    exports: [PassportModule, JwtStrategy, CecitAdminGuard]
})
export class AuthModule { }
