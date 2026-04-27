import { Module } from '@nestjs/common';
import { BenefitTypeService } from './benefit_type.service';
import { BenefitTypeController } from './benefit_type.controller';

@Module({
  providers: [BenefitTypeService],
  controllers: [BenefitTypeController]
})
export class BenefitTypeModule {}
