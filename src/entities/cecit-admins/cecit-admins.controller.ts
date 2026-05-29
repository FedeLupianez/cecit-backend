import { Controller, Get } from '@nestjs/common';
import { CecitAdminsService } from './cecit-admins.service';

@Controller('cecit-admins')
export class CecitAdminsController {
    constructor(private readonly cecitAdminsService: CecitAdminsService) { };

    @Get('all')
    get_all() {
        return this.cecitAdminsService.get_all();
    }
}
