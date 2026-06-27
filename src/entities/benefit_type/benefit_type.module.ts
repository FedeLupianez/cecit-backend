import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitTypeService } from './benefit_type.service';
import { BenefitTypeController } from './benefit_type.controller';
import { BenefitTypeEntity } from './benefit_type.entity';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
    imports: [TypeOrmModule.forFeature([BenefitTypeEntity]), AccountsModule],
    controllers: [BenefitTypeController],
    providers: [BenefitTypeService],
    exports: [BenefitTypeService]
})
export class BenefitTypeModule { }
