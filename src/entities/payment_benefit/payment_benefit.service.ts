import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BenefitsEntity } from '../benefits/benefits.entity';
import { PaymentMethodsEntity } from '../payment-methods/payment-methods.entity';

@Injectable()
export class PaymentBenefitService {
  constructor(
    @InjectRepository(BenefitsEntity)
    private readonly benefitsRepo: Repository<BenefitsEntity>,
    @InjectRepository(PaymentMethodsEntity)
    private readonly paymentMethodsRepo: Repository<PaymentMethodsEntity>,
  ) {}

  async findByBenefit(id_benefit: string): Promise<any[]> {
    const benefit = await this.benefitsRepo.findOne({
      where: { id_benefit },
      relations: ['payment_methods'],
    });
    if (!benefit) return [];
    return benefit.payment_methods.map((pm) => ({
      id_benefit,
      id_payment_method: pm.id_payment_method,
      payment_method: pm,
      benefit,
    }));
  }

  async findByBenefits(ids_benefits: string[]): Promise<any[]> {
    if (!ids_benefits || ids_benefits.length === 0) return [];
    const benefits = await this.benefitsRepo.find({
      where: { id_benefit: In(ids_benefits) },
      relations: ['payment_methods'],
    });
    return benefits.flatMap((b) =>
      b.payment_methods.map((pm) => ({
        id_benefit: b.id_benefit,
        id_payment_method: pm.id_payment_method,
        payment_method: pm,
        benefit: b,
      })),
    );
  }

  async make_relation(
    id_benefit: string,
    payment_method: string,
  ): Promise<boolean> {
    const method = await this.paymentMethodsRepo.findOneBy({
      name: payment_method,
    });
    if (!method) return false;
    const benefit = await this.benefitsRepo.findOne({
      where: { id_benefit },
      relations: ['payment_methods'],
    });
    if (!benefit) return false;
    if (
      benefit.payment_methods.some(
        (pm) => pm.id_payment_method === method.id_payment_method,
      )
    )
      return true;
    benefit.payment_methods.push(method);
    await this.benefitsRepo.save(benefit);
    return true;
  }
}
