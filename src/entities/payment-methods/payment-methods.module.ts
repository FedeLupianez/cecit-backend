import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsEntity } from './payment-methods.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentMethodsEntity])],
    providers: [PaymentMethodsService],
    controllers: [PaymentMethodsController],
})
export class PaymentMethodsModule { }
