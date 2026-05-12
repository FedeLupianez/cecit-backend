import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BenefitsEntity } from '../benefits/benefits.entity';
import { PaymentMethodsEntity } from '../payment-methods/payment-methods.entity';

@Entity('Payment_Benefit')
export class Payment_BenefitEntity {

    @PrimaryColumn({ type: 'int' })
    id_payment_method: number;

    @PrimaryColumn({ type: 'varchar', length: 4 })
    id_benefit: string;

    @ManyToOne(() => PaymentMethodsEntity, { nullable: false })
    @JoinColumn({ name: 'id_payment_method', referencedColumnName: 'id_payment_method' })
    payment_method: PaymentMethodsEntity;

    @ManyToOne(() => BenefitsEntity, { nullable: false })
    @JoinColumn({ name: 'id_benefit', referencedColumnName: 'id_benefit' })
    benefit: BenefitsEntity;

}
