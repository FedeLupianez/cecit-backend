import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsMapper, type BenefitsCreateDTO, type BenefitsDeleteDTO } from './benefits.dto';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';
import { AuthGuard } from '@nestjs/passport';
import { PartnerAdminGuard } from 'src/auth/partneradmin.guard';
import { PartnersAdminsService } from '../partnersadmins/partnersadmins.service';

@Controller('benefits')
export class BenefitsController {
    constructor(
        private readonly benefitsService: BenefitsService,
        private readonly partnersAdminsService: PartnersAdminsService,
    ) { };
    @Get('all')
    async get_all() {
        return await this.benefitsService.get_all();
    }

    @Get('popular')
    async get_popular() {
        return await this.benefitsService.get_popular();
    }

    @Get('news')
    async get_news() {
        return await this.benefitsService.get_news();
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Post()
    async create(@Body() benefit: BenefitsCreateDTO) {
        const newBenefit = await this.benefitsService.create(benefit);
        return BenefitsMapper.toDTO(newBenefit)
    }

    @Post('mine')
    @UseGuards(AuthGuard('jwt'), PartnerAdminGuard)
    async create_for_current_partner(@Req() request, @Body() benefit: Omit<BenefitsCreateDTO, 'id_admin' | 'id_partner' | 'coupons'>) {
        const partner = await this.partnersAdminsService.get_partner_for_admin(request.user.user_id);
        const newBenefit = await this.benefitsService.create({
            ...benefit,
            id_admin: request.user.user_id,
            id_partner: partner.id_partner,
            coupons: 0,
        });
        return BenefitsMapper.toDTO(newBenefit);
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Delete()
    async delete(@Body() benefit: BenefitsDeleteDTO) {
        const result = await this.benefitsService.delete(benefit);
        return result
    }

}
