import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './entities/users/users.module';
import { BenefitsModule } from './entities/benefits/benefits.module';
import { BenefitTypeModule } from './entities/benefit_type/benefit_type.module';
import { PartnersCategoriesModule } from './entities/partners_categories/partners_categories.module';
import { CategoriesModule } from './entities/categories/categories.module';
import { CecitAdminsModule } from './entities/cecit-admins/cecit-admins.module';
import { VouchersModule } from './entities/vouchers/vouchers.module';
import { PartnersModule } from './entities/partners/partners.module';
import { PartnersAdminsModule } from './entities/partnersadmins/partnersadmins.module';
import { PaymentMethodsModule } from './entities/payment-methods/payment-methods.module';
import { PaymentBenefitModule } from './entities/payment_benefit/payment_benefit.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './common/database/db.module';

@Module({
    imports: [
        TypeOrmModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
        CategoriesModule,
        UsersModule,
        BenefitsModule,
        BenefitTypeModule,
        CecitAdminsModule,
        VouchersModule,
        PartnersModule,
        PartnersAdminsModule,
        PartnersCategoriesModule,
        PaymentMethodsModule,
        PaymentBenefitModule,
        AuthModule,
        DbModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }
