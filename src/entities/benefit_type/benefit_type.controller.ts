import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { BenefitTypeService } from './benefit_type.service';
import { BenefitTypeMapper, type BenefitTypeCreateDTO, type BenefitTypeDeleteDTO } from './benefit_type.dto';
import { get } from 'http';

@Controller('benefit-type')
export class BenefitTypeController {
    constructor (private readonly benefit_typeService : BenefitTypeService) { };
    @Get('all')
    get_all() {
        return this.benefit_typeService.get_all();
    }
    
    @Post()
    async create(@Body() benefit_type: BenefitTypeCreateDTO){
        const new_benefitType = await this.benefit_typeService.create(benefit_type);
        return BenefitTypeMapper.toDTO(new_benefitType)
    }

    @Delete()
    async delete(@Body() benefit_type: BenefitTypeDeleteDTO){
        const result = await this.benefit_typeService.delete(benefit_type);
        return result
    }

}
