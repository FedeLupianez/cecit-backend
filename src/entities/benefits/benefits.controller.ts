import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsMapper, type BenefitsCreateDTO, type BenefitsDeleteDTO } from './benefits.dto';
import { get } from 'http';

@Controller('benefits')
export class BenefitsController {
    constructor (private readonly benefitsService : BenefitsService) { };
    @Get('all')
    get_all() {
        return this.benefitsService.get_all();
    }
    
    @Post()
    async create(@Body() benefit: BenefitsCreateDTO){
        const new_benefit = await this.benefitsService.create(benefit);
        return BenefitsMapper.toDTO(new_benefit)
    }

    @Delete()
    async delete(@Body() benefit: BenefitsDeleteDTO){
        const result = await this.benefitsService.delete(benefit);
        return result
    }

}
