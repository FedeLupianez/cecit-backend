import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';


import { UsersModule } from 'src/entities/users/users.module';
import { UsersController } from 'src/entities/users/users.controller';
import { UsersService } from 'src/entities/users/users.service';

import { BenefitsModule } from 'src/entities/benefits/benefits.module';
import { BenefitsService } from 'src/entities/benefits/benefits.service';
import { BenefitsController } from 'src/entities/benefits/benefits.controller';

import { BenefitTypeModule } from 'src/entities/benefit_type/benefit_type.module';
import { BenefitTypeService } from 'src/entities/benefit_type/benefit_type.service';

import { PartnersCategoriesModule } from 'src/entities/partners_categories/partners_categories.module';
import { PartnersCategoriesController } from 'src/entities/partners_categories/partners_categories.controller';
import { PartnersCategoriesService } from 'src/entities/partners_categories/partners_categories.service';

import { CategoriesModule } from 'src/entities/categories/categories.module';
import { CategoriesController } from 'src/entities/categories/categories.controller';
import { CategoriesService } from 'src/entities/categories/categories.service';

import { BenefitTypeController } from 'src/entities/benefit_type/benefit_type.controller';

import { CecitAdminsModule } from 'src/entities/cecit-admins/cecit-admins.module';
import { CecitAdminsController } from 'src/entities/cecit-admins/cecit-admins.controller';
import { CecitAdminsService } from 'src/entities/cecit-admins/cecit-admins.service';

import { VouchersModule } from 'src/entities/vouchers/vouchers.module';
import { VouchersController } from 'src/entities/vouchers/vouchers.controller';
import { VouchersService } from 'src/entities/vouchers/vouchers.service';

import { PartnersModule } from 'src/entities/partners/partners.module';
import { PartnersService } from 'src/entities/partners/partners.service';
import { PartnersController } from 'src/entities/partners/partners.controller';

import { PartnersAdminsModule } from 'src/entities/partnersadmins/partnersadmins.module';
import { PartnersAdminsService } from 'src/entities/partnersadmins/partnersadmins.service';
import { PartnersAdminsController } from 'src/entities/partnersadmins/partnersadmins.controller';

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
    ],
    controllers: [AppController, UsersController, VouchersController, BenefitsController, BenefitTypeController, PartnersAdminsController, PartnersController, CecitAdminsController, PartnersCategoriesController, CategoriesController],
    providers: [AppService, UsersService, BenefitTypeService, BenefitsService, VouchersService, PartnersAdminsService, PartnersService, CecitAdminsService, PartnersCategoriesService, CategoriesService]
})
export class AppModule { }
