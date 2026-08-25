import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VouchersEntity } from './vouchers.entity';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';
import { DbModule } from 'src/common/database/db.module';
import { BenefitsModule } from '../benefits/benefits.module';
import { PdfService } from 'src/pdf/pdf.service';
import { PartnersAdminsModule } from '../partnersadmins/partnersadmins.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([VouchersEntity]),
        DbModule,
        BenefitsModule,
        PartnersAdminsModule,
    ],
    controllers: [VouchersController],
    providers: [VouchersService, PdfService],
    exports: [VouchersService],
})
export class VouchersModule { }
