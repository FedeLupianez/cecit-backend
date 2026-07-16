import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodsEntity } from './payment-methods.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentMethodsService {
    constructor(
        @InjectRepository(PaymentMethodsEntity) private readonly paymentsRepo: Repository<PaymentMethodsEntity>
    ) { }

    async getMethods(): Promise<string[]> {
        const registers = await this.paymentsRepo.find({
            select: {
                id_payment_method: false,
                name: true,
                active: false
            },
            where: {
                active: true
            }
        });
        return registers.map((r) => r.name)
    }
}
