import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentBenefitEntity } from './payment_benefit.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentBenefitEntity])]
})
export class PaymentBenefitModule {}
