/*
* Controlador voucher
*/

import { Controller, Get, Query, Post, Delete, Body, NotFoundException } from "@nestjs/common";
import { VouchersService } from "./vouchers.service";
import { VoucherStatus } from "./vouchers.entity";
import { VouchersMapper } from "./vouchers.dto";
import type { VouchersCreateDTO, VouchersDeleteDTO} from "./vouchers.dto";

@Controller('voucher')
export class VouchersController {
    constructor(private readonly voucherService: VouchersService) { };

    @Get('all')
    get_all() {
        return this.voucherService.get_all();
    }

    @Get('byuser')
    get_by_user(@Query('id_user') id_user: string) {
        return this.voucherService.get_by_user(id_user);
    }

    @Get('bybenefit')
    get_by_benefit(@Query('id_benefit') id_benefit: string) {
        return this.voucherService.get_by_benefit(id_benefit);
    }

    @Get('bytoken')
    get_by_token(@Query('token') token: string) {
        return this.voucherService.get_by_token(token);
    }

    @Get('bystatus')
    get_by_status(@Query('status') status: VoucherStatus) {
        return this.voucherService.get_by_status(status);
    }

    @Post()
    async create(@Body() voucher: VouchersCreateDTO) {
        const new_voucher = await this.voucherService.create(voucher);
        return VouchersMapper.toDTO(new_voucher);
    }

    @Delete()
    async delete(@Body() voucher: VouchersDeleteDTO){
        const voucher_deleted = await this.voucherService.delete(voucher);
        if (!voucher_deleted)
            throw new NotFoundException('Voucher does not exists')
            return { result: 'error' }
        return { result: 'ok' }
    }

}
