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
    StreamableFile,
    UseGuards,
    Logger,
    Patch,
    BadRequestException,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VoucherStatus } from './vouchers.entity';
import { VouchersMapper } from './vouchers.dto';
import type { VouchersCreateDTO, VouchersDeleteDTO } from './vouchers.dto';

import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('vouchers')
export class VouchersController {
    private readonly logger = new Logger(VouchersController.name);
    constructor(private readonly voucherService: VouchersService) { }

    @Get('all')
    async get_all() {
        return await this.voucherService.get_all();
    }

    @Get('byuser')
    async get_by_user(@Query('id_user') id_user: string) {
        return await this.voucherService.get_by_user(id_user);
    }

    @Get('bybenefit')
    async get_by_benefit(@Query('id_benefit') id_benefit: string) {
        return await this.voucherService.get_by_benefit(id_benefit);
    }

    @Get('bytoken')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    async get_by_token(@Query('token') token: string) {
        return await this.voucherService.get_by_token(token);
    }

    @Get('userbenefit')
    async get_by_user_benefit(
        @Query('id_account') id_account: string,
        @Query('id_benefit') id_benefit: string,
    ) {
        this.logger.debug(`Account: ${id_account}, Benefit: ${id_benefit}`);
        return await this.voucherService.get_by_user_benefit({ id_account, id_benefit });
    }

    @Get('bystatus')
    async get_by_status(@Query('status') status: VoucherStatus) {
        return await this.voucherService.get_by_status(status);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async create(@Body() voucher: VouchersCreateDTO) {
        this.logger.log(
            `Creating voucher for user ${voucher.id_user}, benefit ${voucher.id_benefit}`,
        );
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
    async file(@Query('token') token: string, @Res({ passthrough: true }) res) {
        const file = await this.voucherService.gen_file(token);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=cecit_voucher_${token}.pdf`,
            'Content-Length': file.length,
        });
        return new StreamableFile(file);
    }

    @Patch('')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    async updateVoucher(@Query('action') action: string, @Query('token') token: string) {
        if (action == 'redeem') {
            return await this.voucherService.redeem_voucher(token);
        } else if (action == 'reject') {
            return await this.voucherService.reject_voucher(token);
        }
        throw new BadRequestException('Bad Action')
    }
}
