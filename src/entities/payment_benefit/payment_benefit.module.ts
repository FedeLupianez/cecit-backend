import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentBenefitEntity } from './payment_benefit.entity';
import { PaymentBenefitService } from './payment_benefit.service';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentBenefitEntity])],
    providers: [PaymentBenefitService],
    exports: [PaymentBenefitService]
})
export class PaymentBenefitModule { }
