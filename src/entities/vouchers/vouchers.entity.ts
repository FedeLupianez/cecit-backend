import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { UsersEntity } from 'src/entities/users/users.entity';
import { BenefitsEntity } from 'src/entities/benefits/benefits.entity';

export enum VoucherStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED'
}

@Entity('Vouchers')
export class VouchersEntity {
    @PrimaryColumn({ type: 'varchar', length: 6 })
    token: string;

    @ManyToOne(() => UsersEntity, (user) => user.id_user)
    @JoinColumn({ name: 'id_user', referencedColumnName: 'id_user' })
    user: UsersEntity;

    @ManyToOne(() => BenefitsEntity, (benefit) => benefit.id_benefit)
    @JoinColumn({ name: 'id_benefit', referencedColumnName: 'id_benefit' })
    benefit: BenefitsEntity;

    @Column({ type: 'date' })
    application_date: string;

    @Column({ default: null, type: 'date' })
    delivery_date: string;

    @Column({ type: 'enum', enum: VoucherStatus, default: VoucherStatus.PENDING })
    status: VoucherStatus;
}
