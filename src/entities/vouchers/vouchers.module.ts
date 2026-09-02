import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VouchersEntity } from './vouchers.entity';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';
import { BenefitsModule } from '../benefits/benefits.module';
import { PdfService } from 'src/pdf/pdf.service';
import { PartnersAdminsModule } from '../partnersadmins/partnersadmins.module';
import { AccountsModule } from '../accounts/accounts.module';
import { AdminGuard } from 'src/auth/admin.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([VouchersEntity]),
        BenefitsModule,
        PartnersAdminsModule,
        AccountsModule,
    ],
    controllers: [VouchersController],
    providers: [VouchersService, PdfService, AdminGuard],
    exports: [VouchersService],
})
export class VouchersModule { }
