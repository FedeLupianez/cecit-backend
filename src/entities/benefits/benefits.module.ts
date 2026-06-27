import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { BenefitTypeEntity } from '../benefit_type/benefit_type.entity';
import { BenefitsEntity } from './benefits.entity';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { DbModule } from 'src/common/database/db.module';
import { CategoriesModule } from '../categories/categories.module';
import { PartnersModule } from '../partners/partners.module';
import { PartnersCategoriesEntity } from '../partners_categories/partners_categories.entity';
import { AccountsModule } from '../accounts/accounts.module';


@Module({
    imports: [TypeOrmModule.forFeature([BenefitsEntity, BenefitTypeEntity, PartnersCategoriesEntity]), DbModule, CategoriesModule, PartnersModule, AccountsModule],
    providers: [BenefitsService],
    controllers: [BenefitsController],
    exports: [BenefitsService]
})
export class BenefitsModule { }
