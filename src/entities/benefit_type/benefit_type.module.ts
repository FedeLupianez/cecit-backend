import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitTypeService } from './benefit_type.service';
import { BenefitTypeController } from './benefit_type.controller';
import { BenefitTypeEntity } from './benefit_type.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BenefitTypeEntity])],
    controllers: [BenefitTypeController],
    providers: [BenefitTypeService],
    exports: [BenefitTypeService]
})
export class BenefitTypeModule { }
