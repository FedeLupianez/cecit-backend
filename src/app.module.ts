import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';


import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';


import { BenefitsModule } from './benefits/benefits.module';
import { BenefitsService } from './benefits/benefits.service';
import { BenefitsController } from './benefits/benefits.controller';

import { BenefitTypeModule } from './benefit_type/benefit_type.module';
import { BenefitTypeService } from './benefit_type/benefit_type.service';

import { PartnersCategoriesModule } from './partners_categories/partners_categories.module';
import { PartnersCategoriesController } from './partners_categories/partners_categories.controller';
import { PartnersCategoriesService } from './partners_categories/partners_categories.service';

import { CategoriesModule } from './categories/categories.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';

import { BenefitTypeController } from './benefit_type/benefit_type.controller';

import { CecitAdminsModule } from './cecit-admins/cecit-admins.module';
import { CecitAdminsController } from './cecit-admins/cecit-admins.controller';
import { CecitAdminsService } from './cecit-admins/cecit-admins.service';

import { VoucherModule } from './vouchers/voucher.module';
import { VoucherController } from './vouchers/voucher.controller';
import { VoucherService } from './vouchers/voucher.service';


import { PartnersModule } from './partners/partners.module';
import { PartnersService } from './partners/partners.service';
import { PartnersController } from './partners/partners.controller';

import { PartnersAdminsModule } from './partnersadmins/partnersadmins.module';
import { PartnersAdminsService } from './partnersadmins/partnersadmins.service';
import { PartnersAdminsController } from './partnersadmins/partnersadmins.controller';

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
        VoucherModule,
        PartnersModule,
        PartnersAdminsModule,
        PartnersCategoriesModule,
    ],
    controllers: [AppController, UsersController, VoucherController, BenefitsController, BenefitTypeController, PartnersAdminsController, PartnersController, CecitAdminsController, PartnersCategoriesController, CategoriesController],
    providers: [AppService, UsersService, BenefitTypeService, BenefitsService, VoucherService, PartnersAdminsService, PartnersService, CecitAdminsService, PartnersCategoriesService, CategoriesService]
})
export class AppModule { }
