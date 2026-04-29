import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule } from '@nestjs/config';

import { CategoriesModule } from './categories/categories.module';

import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';


import { BenefitsModule } from './benefits/benefits.module';
import { BenefitsService } from './benefits/benefits.service';
import { BenefitsController } from './benefits/benefits.controller';

import { BenefitTypeModule } from './benefit_type/benefit_type.module';
import { BenefitTypeService } from './benefit_type/benefit_type.service';
import { BenefitTypeController } from './benefit_type/benefit_type.controller';

import { CecitAdminsModule } from './cecit-admins/cecit-admins.module';

import { VoucherModule } from './vouchers/voucher.module';
import { VoucherController } from './vouchers/voucher.controller';
import { VoucherService } from './vouchers/voucher.service';


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
        VoucherModule
    ],
    controllers: [AppController, UsersController, VoucherController, BenefitsController, BenefitTypeController],
    providers: [AppService, UsersService, BenefitTypeService, BenefitsService, VoucherService],
})
export class AppModule { }
