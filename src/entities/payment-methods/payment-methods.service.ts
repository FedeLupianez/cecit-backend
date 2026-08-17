import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodsEntity } from './payment-methods.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PaymentMethodsService {
    constructor(
        @InjectRepository(PaymentMethodsEntity)
        private readonly paymentsRepo: Repository<PaymentMethodsEntity>,
        @Inject(CACHE_MANAGER) private cache: Cache,
    ) { }

    async getMethods(): Promise<string[]> {
        const cached = await this.cache.get<string[]>('payment-methods:active');
        if (cached) return cached;

        const registers = await this.paymentsRepo.find({
            select: {
                id_payment_method: false,
                name: true,
                active: false,
            },
            where: {
                active: true,
            },
        });
        const result = registers.map((r) => r.name);
        await this.cache.set('payment-methods:active', result);
        return result;
    }
}
