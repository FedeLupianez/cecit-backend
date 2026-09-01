import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitsEntity } from './benefits.entity';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { CategoriesModule } from '../categories/categories.module';
import { PartnersModule } from '../partners/partners.module';
import { AccountsModule } from '../accounts/accounts.module';
import { BenefitTypeModule } from '../benefit-types/benefit-types.module';
import { PartnersCategoriesModule } from '../partners_categories/partners_categories.module';
import { PaymentBenefitModule } from '../payment_benefit/payment_benefit.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([BenefitsEntity]),
        CategoriesModule,
        PartnersModule,
        AccountsModule,
        BenefitTypeModule,
        PartnersCategoriesModule,
        PaymentBenefitModule,
    ],
    providers: [BenefitsService],
    controllers: [BenefitsController],
    exports: [BenefitsService],
})
export class BenefitsModule { }
