/*
 * Controlador voucher
 */

import {
    Controller,
    Get,
    Query,
    Post,
    Delete,
    Body,
    NotFoundException,
    Res,
    UseGuards,
    Logger,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VoucherStatus } from './vouchers.entity';
import { VouchersMapper } from './vouchers.dto';
import type {
    VouchersCreateDTO,
    VouchersDeleteDTO,
} from './vouchers.dto';

import { AuthGuard } from '@nestjs/passport';

@Controller('vouchers')
export class VouchersController {
    private readonly logger = new Logger(VouchersController.name);
    constructor(private readonly voucherService: VouchersService) { }

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

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async create(@Body() voucher: VouchersCreateDTO) {
        this.logger.log(`Creating voucher for user ${voucher.id_user}, benefit ${voucher.id_benefit}`);
        const newVoucher = await this.voucherService.create(voucher);
        return VouchersMapper.toDTO(newVoucher);
    }

    @Delete()
    async delete(@Body() voucher: VouchersDeleteDTO) {
        const voucherDeleted = await this.voucherService.delete(voucher);
        if (!voucherDeleted) {
            throw new NotFoundException('Voucher does not exists');
        }
        return { result: 'ok' };
    }

    @Get('file')
    @UseGuards(AuthGuard('jwt'))
    async file(@Query('token') token: string, @Res() res) {
        const file = await this.voucherService.gen_file(token);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=cecit_voucher_${token}.pdf`,
            'Content-Lenght': file.length,
        });
        return res.end(file);
    }
}
