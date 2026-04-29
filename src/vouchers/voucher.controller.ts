/*
* Controlador voucher
*/

import { Controller, Get, Query } from "@nestjs/common";
import { VoucherService } from "./voucher.service";

@Controller('voucher')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) { };

    @Get('all')
    get_all() {
        return this.voucherService.get_all();
    }

    @Get('byuser')
    get_by_user(@Query('id_user') id_user: number) {
        return this.voucherService.get_by_user(id_user);
    }

    @Get('bybenefit')
    get_by_benefit(@Query('id_benefit') id_benefit: number) {
        return this.voucherService.get_by_benefit(id_benefit);
    }

    @Get('bytoken')
    get_by_token(@Query('token') token: string) {
        return this.voucherService.get_by_token(token);
    }

    @Get('bystatus')
    get_by_status(@Query('status') status: Enumerator) {
        return this.voucherService.get_by_status(status);
    }
}