import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentBenefitEntity } from './payment_benefit.entity';

@Injectable()
export class PaymentBenefitService {
    constructor(
        @InjectRepository(PaymentBenefitEntity)
        private readonly repo: Repository<PaymentBenefitEntity>,
    ) { }

    async findByBenefit(id_benefit: string): Promise<PaymentBenefitEntity[]> {
        return await this.repo.find({
            relations: ['payment_method'],
            where: { id_benefit },
        });
    }
}
