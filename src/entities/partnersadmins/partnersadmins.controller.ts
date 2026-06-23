import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PartnersAdminsService } from './partnersadmins.service';
import { PartnersAdminsCreateDTO } from './partnersadmins.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('partners-admins')
export class PartnersAdminsController {
    constructor(
        private readonly adminsService: PartnersAdminsService
    ) { }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Post('create')
    async create(@Body() body: PartnersAdminsCreateDTO) {
        return await this.adminsService.create(body);
    }

}
