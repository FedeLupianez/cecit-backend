import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { BenefitTypeService } from './benefit-types.service';
import {
    BenefitTypeMapper,
    type BenefitTypeCreateDTO,
    type BenefitTypeDeleteDTO,
} from './benefit-types.dto';
import { AuthGuard } from '@nestjs/passport';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';

@Controller('benefit-types')
export class BenefitTypeController {
    constructor(private readonly benefitTypeService: BenefitTypeService) { }
    @Get('all')
    get_all() {
        return this.benefitTypeService.get_all();
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Post()
    async create(@Body() benefitType: BenefitTypeCreateDTO) {
        const newBenefitType = await this.benefitTypeService.create(benefitType);
        return BenefitTypeMapper.toDTO(newBenefitType);
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Delete()
    async delete(@Body() benefitType: BenefitTypeDeleteDTO) {
        const result = await this.benefitTypeService.delete(benefitType);
        return result;
    }
}
