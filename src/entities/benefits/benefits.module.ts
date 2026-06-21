import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { CecitAdminsEntity } from '../cecit-admins/cecit-admins.entity';
import { PartnersEntity } from '../partners/partners.entity';
import { BenefitTypeEntity } from '../benefit_type/benefit_type.entity';
import { BenefitsEntity } from './benefits.entity';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { DbModule } from 'src/common/database/db.module';
import { CecitAdminsModule } from 'src/entities/cecit-admins/cecit-admins.module';


@Module({
    imports: [TypeOrmModule.forFeature([BenefitsEntity, CecitAdminsEntity, PartnersEntity, BenefitTypeEntity]), DbModule, CecitAdminsModule],
    providers: [BenefitsService],
    controllers: [BenefitsController],
    exports: [BenefitsService]
})
export class BenefitsModule { }
