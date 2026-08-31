import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PartnersAdminsService } from './partnersadmins.service';
import { PartnersAdminsCreateDTO } from './partnersadmins.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('partners-admins')
export class PartnersAdminsController {
    constructor(private readonly adminsService: PartnersAdminsService) { }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Post('create')
    async create(@Body() body: PartnersAdminsCreateDTO) {
        return await this.adminsService.create(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async get_my_partner(@Req() request) {
        const user = request.user;
        if (!user)
            throw new UnauthorizedException('User is not logued');
        const partner_admin = await this.adminsService.get_by_id(user.user_id);
        if (!partner_admin.partner)
            throw new UnauthorizedException('Partner not found');

        return {
            ...partner_admin.partner,
            directions: partner_admin.partner.directions?.map(
                (d) => d.direction,
            ),
        };
    }
}
