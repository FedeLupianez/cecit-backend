import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaymentBenefitEntity } from './payment_benefit.entity';
import { PaymentMethodsEntity } from '../payment-methods/payment-methods.entity';

@Injectable()
export class PaymentBenefitService {
    constructor(
        @InjectRepository(PaymentBenefitEntity)
        private readonly repo: Repository<PaymentBenefitEntity>,
        @InjectRepository(PaymentMethodsEntity)
        private readonly paymentMethodsRepo: Repository<PaymentMethodsEntity>,
    ) { }

    async findByBenefit(id_benefit: string): Promise<PaymentBenefitEntity[]> {
        return await this.repo.find({
            relations: ['payment_method'],
            where: { id_benefit },
        });
    }

    async findByBenefits(ids_benefits: string[]): Promise<PaymentBenefitEntity[]> {
        if (!ids_benefits || ids_benefits.length === 0) return [];
        return await this.repo.find({
            relations: ['payment_method'],
            where: { id_benefit: In(ids_benefits) },
        });
    }

    async make_relation(id_benefit: string, payment_method: string): Promise<boolean> {
        const method = await this.paymentMethodsRepo.findOneBy({
            name: payment_method,
        });
        if (!method) return false;

        const exists = await this.repo.findOneBy({
            id_benefit,
            id_payment_method: method.id_payment_method,
        });
        if (exists) return true;

        const relation = this.repo.create({
            id_benefit,
            id_payment_method: method.id_payment_method,
        });
        await this.repo.save(relation);
        return true;
    }
}
