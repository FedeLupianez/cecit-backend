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
  Patch,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VoucherStatus } from './vouchers.entity';
import { VouchersMapper } from './vouchers.dto';
import type { VouchersCreateDTO, VouchersDeleteDTO } from './vouchers.dto';

import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly voucherService: VouchersService) {}

  @Get('all')
  async get_all() {
    return await this.voucherService.get_all();
  }

  @Get('byuser')
  async get_by_user(
    @Query('id_account') id_account: string,
    @Query('id_user') id_user: string,
  ) {
    return await this.voucherService.get_by_account(id_account ?? id_user);
  }

  @Get('byaccount')
  async get_by_account(@Query('id_account') id_account: string) {
    return await this.voucherService.get_by_account(id_account);
  }

  @Get('bybenefit')
  async get_by_benefit(@Query('id_benefit') id_benefit: string) {
    return await this.voucherService.get_by_benefit(id_benefit);
  }

  @Get('redeemed')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async get_redeemed_by_benefit(
    @Query('id_benefit') id_benefit: string,
    @Query('id_partner') id_partner: string,
    @Req() req,
  ) {
    if (!id_benefit) throw new BadRequestException('id_benefit is required');
    return await this.voucherService.get_redeemed_by_benefit(
      id_benefit,
      req.user.user_id,
      id_partner,
    );
  }

  @Get('bytoken')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async get_by_token(@Query('token') token: string, @Req() req) {
    const id_admin = req.user.user_id;
    return await this.voucherService.get_by_token(token, id_admin);
  }

  @Get('userbenefit')
  async get_by_user_benefit(
    @Query('id_account') id_account: string,
    @Query('id_benefit') id_benefit: string,
  ) {
    return await this.voucherService.get_by_user_benefit({
      id_account,
      id_benefit,
    });
  }

  @Get('bystatus')
  async get_by_status(@Query('status') status: VoucherStatus) {
    return await this.voucherService.get_by_status(status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Body() voucher: VouchersCreateDTO, @Req() req) {
    const id_account = voucher.id_account ?? req.user?.user_id;
    if (!id_account) throw new BadRequestException('id_account is required');
    const newVoucher = await this.voucherService.create({
      ...voucher,
      id_account,
    });
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
  async updateVoucher(
    @Query('action') action: string,
    @Query('token') token: string,
    @Req() request,
  ) {
    const user = request.user;
    if (action == 'redeem') {
      return await this.voucherService.redeem_voucher(token, user.user_id);
    } else if (action == 'reject') {
      return await this.voucherService.reject_voucher(token, user.user_id);
    }
    throw new BadRequestException('Bad Action');
  }
}
