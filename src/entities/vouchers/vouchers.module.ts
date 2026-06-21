/*
 * Modulo de Voucher para el uso en todo el sistema
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VouchersEntity } from './vouchers.entity';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';
import { DbModule } from 'src/common/database/db.module';
import { BenefitsEntity } from '../benefits/benefits.entity';
import { PdfService } from 'src/pdf/pdf.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([VouchersEntity, BenefitsEntity]),
        DbModule,
    ],
    controllers: [VouchersController],
    providers: [VouchersService, PdfService],
    exports: [VouchersService],
})
export class VouchersModule { }
