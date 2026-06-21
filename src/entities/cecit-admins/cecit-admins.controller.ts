import { Controller, Get, UseGuards } from '@nestjs/common';
import { CecitAdminsService } from './cecit-admins.service';
import { AuthGuard } from '@nestjs/passport';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';

@Controller('cecit-admins')
export class CecitAdminsController {
    constructor(private readonly cecitAdminsService: CecitAdminsService) { };

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Get('all')
    get_all() {
        return this.cecitAdminsService.get_all();
    }
}
