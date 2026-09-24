import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitsEntity } from '../benefits/benefits.entity';
import { PaymentBenefitService } from './payment_benefit.service';
import { PaymentMethodsEntity } from '../payment-methods/payment-methods.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BenefitsEntity, PaymentMethodsEntity])],
    providers: [PaymentBenefitService],
    exports: [PaymentBenefitService],
})
export class PaymentBenefitModule { }
