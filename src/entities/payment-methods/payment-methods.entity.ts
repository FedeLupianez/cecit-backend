import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PaymentMethods')
export class PaymentMethodsEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id_payment_method' })
    id_payment_method !: number;

    @Column({ type: 'varchar', length: 50 })
    name !: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;
}
