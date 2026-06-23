import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CecitAdminsService } from './cecit-admins.service';
import { AuthGuard } from '@nestjs/passport';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';
import { CecitAdminsCreateDTO } from './cecit-admins.dto';

@Controller('cecit-admins')
export class CecitAdminsController {
    constructor(private readonly cecitAdminsService: CecitAdminsService) { };

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Get('all')
    async get_all() {
        return await this.cecitAdminsService.get_all();
    }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Post('create')
    async create(@Body() body: CecitAdminsCreateDTO) {
        const newAdmin = await this.cecitAdminsService.create(body);
        if (newAdmin) {
            return {
                message: 'ok',
                error: false
            }
        }
        return {
            message: 'fail',
            error: true
        }
    }
}
