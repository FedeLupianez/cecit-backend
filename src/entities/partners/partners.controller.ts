import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnersAdminsService } from '../partnersadmins/partnersadmins.service';
import {
    AddLocationDTO,
    PartnersCreateDTO,
    PartnersUpdateLogoDTO,
    PartnersUpdateNameDTO,
} from './partners.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('partners')
export class PartnersController {
    constructor(
        private readonly partnersService: PartnersService,
        private readonly adminsService: PartnersAdminsService,
    ) { }

    @Get('all')
    async get_all() {
        return await this.partnersService.get_all();
    }

    @Post()
    async create(@Body() dto: PartnersCreateDTO) {
        const partner = await this.partnersService.create(dto);
        await this.adminsService.create({
            partner_name: dto.partner_name.toLowerCase(),
            email: dto.email,
            password: dto.password,
        });
        return partner;
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.partnersService.remove(id);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch('logo')
    async updateLogo(@Body() body: PartnersUpdateLogoDTO, @Req() req) {
        return this.partnersService.updateLogo(body, req.user?.user_id);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch('name')
    async updateName(@Body() body: PartnersUpdateNameDTO, @Req() req) {
        return this.partnersService.updateName(body, req.user?.user_id);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Get('locations')
    async getLocations(@Query('id_partner') id_partner: string) {
        return this.partnersService.getLocations(id_partner);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Post('locations')
    async addLocation(@Body() body: AddLocationDTO, @Req() req) {
        return this.partnersService.addLocation(body, req.user?.user_id);
    }
}
