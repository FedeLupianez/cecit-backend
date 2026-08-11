import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './entities/users/users.module';
import { BenefitsModule } from './entities/benefits/benefits.module';
import { BenefitTypeModule } from './entities/benefit-types/benefit-types.module';
import { PartnersCategoriesModule } from './entities/partners_categories/partners_categories.module';
import { CategoriesModule } from './entities/categories/categories.module';
import { VouchersModule } from './entities/vouchers/vouchers.module';
import { PartnersAdminsModule } from './entities/partnersadmins/partnersadmins.module';
import { PaymentMethodsModule } from './entities/payment-methods/payment-methods.module';
import { PaymentBenefitModule } from './entities/payment_benefit/payment_benefit.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './common/database/db.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { NoTransformInterceptor } from './common/no-transform.interceptor';
import { PartnersModule } from './entities/partners/partners.module';
import { AccountsModule } from './entities/accounts/accounts.module';
import { SshTunnelModule } from './ssh/ssh-tunnel.module';
import { SshTunnelService } from './ssh/ssh-tunnel.service';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
        SshTunnelModule,
        TypeOrmModule.forRootAsync({
            imports: [SshTunnelModule],
            inject: [SshTunnelService],
            useFactory: async (ssh: SshTunnelService) => {
                await ssh.createTunnel();
                return {
                    type: 'mariadb',
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT) || 3307,
                    username: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    autoLoadEntities: true,
                    synchronize: false,
                }
            }
        }),
        ThrottlerModule.forRoot({
            throttlers: [{ ttl: 60000, limit: 20 }]

        }),
        CategoriesModule,
        UsersModule,
        BenefitsModule,
        BenefitTypeModule,
        VouchersModule,
        PartnersAdminsModule,
        PartnersCategoriesModule,
        PaymentMethodsModule,
        PaymentBenefitModule,
        AuthModule,
        DbModule,
        PartnersModule,
        AccountsModule,
    ],
    controllers: [AppController],
    providers: [AppService,
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_INTERCEPTOR, useClass: NoTransformInterceptor },
    ]
})
export class AppModule { }
