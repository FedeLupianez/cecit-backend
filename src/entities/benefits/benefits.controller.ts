import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import {
    BenefitsMapper,
    type BenefitsCreateDTO,
    BenefitIDTO,
    BenefitsUpdateDTO,
} from './benefits.dto';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('benefits')
export class BenefitsController {
    constructor(private readonly benefitsService: BenefitsService) { }
    @Get('all')
    async get_all() {
        return await this.benefitsService.get_all();
    }

    @Get('actives')
    async getActives() {
        return await this.benefitsService.get_actives();
    }

    @Get('popular')
    async get_popular() {
        return await this.benefitsService.get_popular();
    }

    @Get('news')
    async get_news() {
        return await this.benefitsService.get_news();
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Get('partner')
    async get_by_partner(@Query('id_partner') id_partner: string) {
        return await this.benefitsService.get_by_partner(id_partner);
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Post()
    async create(@Body() benefit: BenefitsCreateDTO) {
        const newBenefit = await this.benefitsService.create(benefit);
        return BenefitsMapper.toDTO(newBenefit);
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Delete()
    async delete(@Body() benefit: BenefitIDTO) {
        const result = await this.benefitsService.delete(benefit);
        return result;
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Patch()
    async update(@Body() benefit: BenefitsUpdateDTO) {
        return await this.benefitsService.update(benefit);
    }

    @Get('carousel')
    async get_carousel() {
        return await this.benefitsService.get_carousel();
    }

    @Get('benefit')
    async get_benefit(@Body() benefit: BenefitIDTO) {
        return this.benefitsService.get_benefit(benefit.id_benefit);
    }
}
