import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

    async findByBenefits(ids_benefits: string[]): Promise<PaymentBenefitEntity[]> {
        if (ids_benefits.length === 0) return [];
        return await this.repo.find({
            relations: ['payment_method'],
            where: { id_benefit: In(ids_benefits) },
        });
    }
}
