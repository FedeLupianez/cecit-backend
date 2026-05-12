import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';


import { UsersModule } from './entities/users/users.module';
import { UsersController } from './entities/users/users.controller';
import { UsersService } from './entities/users/users.service';

import { BenefitsModule } from './entities/benefits/benefits.module';
import { BenefitsService } from './entities/benefits/benefits.service';
import { BenefitsController } from './entities/benefits/benefits.controller';

import { BenefitTypeModule } from './entities/benefit_type/benefit_type.module';
import { BenefitTypeService } from './entities/benefit_type/benefit_type.service';

import { PartnersCategoriesModule } from './entities/partners_categories/partners_categories.module';
import { PartnersCategoriesController } from './entities/partners_categories/partners_categories.controller';
import { PartnersCategoriesService } from './entities/partners_categories/partners_categories.service';

import { CategoriesModule } from './entities/categories/categories.module';
import { CategoriesController } from './entities/categories/categories.controller';
import { CategoriesService } from './entities/categories/categories.service';

import { BenefitTypeController } from './entities/benefit_type/benefit_type.controller';

import { CecitAdminsModule } from './entities/cecit-admins/cecit-admins.module';
import { CecitAdminsController } from './entities/cecit-admins/cecit-admins.controller';
import { CecitAdminsService } from './entities/cecit-admins/cecit-admins.service';

import { VouchersModule } from './entities/vouchers/vouchers.module';
import { VouchersController } from './entities/vouchers/vouchers.controller';
import { VouchersService } from './entities/vouchers/vouchers.service';

import { PartnersModule } from './entities/partners/partners.module';
import { PartnersService } from './entities/partners/partners.service';
import { PartnersController } from './entities/partners/partners.controller';

import { PartnersAdminsModule } from './entities/partnersadmins/partnersadmins.module';
import { PartnersAdminsService } from './entities/partnersadmins/partnersadmins.service';
import { PartnersAdminsController } from './entities/partnersadmins/partnersadmins.controller';

import { PaymentMethodsModule } from './entities/payment-methods/payment-methods.module';

import { PaymentBenefitController } from './entities/payment_benefit/payment_benefit.controller';
import { PaymentBenefitService } from './entities/payment_benefit/payment_benefit.service';
import { PaymentBenefitModule } from './entities/payment_benefit/payment_benefit.module';

@Module({
    imports: [
        TypeOrmModule,
        // Cargar la config del archivo .env para uso global
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
    ],
    controllers: [AppController, UsersController, VouchersController, BenefitsController, BenefitTypeController, PartnersAdminsController, PartnersController, CecitAdminsController, PartnersCategoriesController, CategoriesController, PaymentBenefitController],
    providers: [AppService, UsersService, BenefitTypeService, BenefitsService, VouchersService, PartnersAdminsService, PartnersService, CecitAdminsService, PartnersCategoriesService, CategoriesService, PaymentBenefitService]
})
export class AppModule { }
