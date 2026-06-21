import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { BenefitTypeService } from './benefit_type.service';
import { BenefitTypeMapper, type BenefitTypeCreateDTO, type BenefitTypeDeleteDTO } from './benefit_type.dto';
import { AuthGuard } from '@nestjs/passport';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';

@Controller('benefit-type')
export class BenefitTypeController {
    constructor(private readonly benefit_typeService: BenefitTypeService) { };
    @Get('all')
    get_all() {
        return this.benefit_typeService.get_all();
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Post()
    async create(@Body() benefit_type: BenefitTypeCreateDTO) {
        const new_benefitType = await this.benefit_typeService.create(benefit_type);
        return BenefitTypeMapper.toDTO(new_benefitType)
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Delete()
    async delete(@Body() benefit_type: BenefitTypeDeleteDTO) {
        const result = await this.benefit_typeService.delete(benefit_type);
        return result
    }

}
