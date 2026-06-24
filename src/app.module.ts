import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './entities/users/users.module';
import { BenefitsModule } from './entities/benefits/benefits.module';
import { BenefitTypeModule } from './entities/benefit_type/benefit_type.module';
import { PartnersCategoriesModule } from './entities/partners_categories/partners_categories.module';
import { CategoriesModule } from './entities/categories/categories.module';
import { CecitAdminsModule } from './entities/cecit-admins/cecit-admins.module';
import { VouchersModule } from './entities/vouchers/vouchers.module';
import { PartnersAdminsModule } from './entities/partnersadmins/partnersadmins.module';
import { PaymentMethodsModule } from './entities/payment-methods/payment-methods.module';
import { PaymentBenefitModule } from './entities/payment_benefit/payment_benefit.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './common/database/db.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConsumerService } from './consumer/consumer.service';
import { ConsumerModule } from './consumer/consumer.module';
import { PartnersModule } from './entities/partners/partners.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
        TypeOrmModule.forRoot({
            type: 'mariadb',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT) || 3307,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: false,
        }),
        ThrottlerModule.forRoot({
            throttlers: [{ ttl: 60000, limit: 10 }]

        }),
        CategoriesModule,
        UsersModule,
        BenefitsModule,
        BenefitTypeModule,
        CecitAdminsModule,
        VouchersModule,
        PartnersAdminsModule,
        PartnersCategoriesModule,
        PaymentMethodsModule,
        PaymentBenefitModule,
        AuthModule,
        DbModule,
        ConsumerModule,
        PartnersModule
    ],
    controllers: [AppController],
    providers: [AppService,
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        ConsumerService
    ]
})
export class AppModule { }
