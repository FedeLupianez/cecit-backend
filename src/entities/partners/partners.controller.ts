import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnersAdminsService } from '../partnersadmins/partnersadmins.service';
import {
    PartnersCreateDTO,
    PartnersUpdateLogoDTO,
    PartnersUpdateNameDTO,
} from './partners.dto';
import { AdminGuard } from 'src/auth/admin.guard';
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

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.partnersService.remove(id);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch('logo')
    async updateLogo(@Body() body: PartnersUpdateLogoDTO) {
        return this.partnersService.updateLogo(body);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch('name')
    async updateName(@Body() body: PartnersUpdateNameDTO) {
        return this.partnersService.updateName(body);
    }
}
