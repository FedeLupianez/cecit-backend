import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { CecitAdminsEntity } from '../cecit-admins/cecit-admins.entity';
import { BenefitTypeEntity } from '../benefit_type/benefit_type.entity';
import { BenefitsEntity } from './benefits.entity';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { DbModule } from 'src/common/database/db.module';
import { CecitAdminsModule } from 'src/entities/cecit-admins/cecit-admins.module';
import { CategoriesModule } from '../categories/categories.module';
import { PartnersModule } from '../partners/partners.module';
import { PartnersCategoriesEntity } from '../partners_categories/partners_categories.entity';


@Module({
    imports: [TypeOrmModule.forFeature([BenefitsEntity, CecitAdminsEntity, BenefitTypeEntity, PartnersCategoriesEntity]), DbModule, CecitAdminsModule, CategoriesModule, PartnersModule],
    providers: [BenefitsService],
    controllers: [BenefitsController],
    exports: [BenefitsService]
})
export class BenefitsModule { }
