import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsMapper, type BenefitsCreateDTO, type BenefitsDeleteDTO } from './benefits.dto';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('benefits')
export class BenefitsController {
    constructor(private readonly benefitsService: BenefitsService) { };
    @Get('all')
    async get_all() {
        return await this.benefitsService.get_all();
    }

    @Get('popular')
    async get_popular() {
        return await this.benefitsService.get_popular();
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Post()
    async create(@Body() benefit: BenefitsCreateDTO) {
        const newBenefit = await this.benefitsService.create(benefit);
        return BenefitsMapper.toDTO(newBenefit)
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Delete()
    async delete(@Body() benefit: BenefitsDeleteDTO) {
        const result = await this.benefitsService.delete(benefit);
        return result
    }

}
