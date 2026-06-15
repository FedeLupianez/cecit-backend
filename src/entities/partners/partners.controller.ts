import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PartnersService } from './partners.service';
import type { PartnersCreateDTO, PartnersUpdateLogoDTO, PartnersUpdateNameDTO } from './partners.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';


@Controller('partners')
export class PartnersController {

    constructor(private readonly partnersService: PartnersService) { }

    @Post()
    async create(@Body() dto: PartnersCreateDTO) {
        return this.partnersService.create(dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.partnersService.remove(id);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch('newlogo')
    async update_logo(@Body() body: PartnersUpdateLogoDTO) {
        return this.partnersService.update_logo(body);
    }


    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch('newname')
    async update_name(@Body() body: PartnersUpdateNameDTO) {
        return this.partnersService.update_name(body);
    }

}
