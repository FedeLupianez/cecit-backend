import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn, Index } from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { BenefitsEntity } from '../benefits/benefits.entity';

export enum VoucherStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED'
}

@Entity('Vouchers')
export class VouchersEntity {
    @PrimaryColumn({ type: 'varchar', length: 6 })
    token: string;

    @Index()
    @Column({ type: 'varchar', length: 4 })
    id_user !: string;

    @Index()
    @Column({ type: 'varchar', length: 4 })
    id_benefit !: string;

    @ManyToOne(() => UsersEntity, { nullable: false })
    @JoinColumn({ name: 'id_user', referencedColumnName: 'id_user' })
    user: UsersEntity;

    @ManyToOne(() => BenefitsEntity, { nullable: false })
    @JoinColumn({ name: 'id_benefit', referencedColumnName: 'id_benefit' })
    benefit: BenefitsEntity;

    @Column({ type: 'date' })
    application_date: string;

    @Column({ default: null, type: 'date' })
    delivery_date: string;

    @Column({ type: 'enum', enum: VoucherStatus, default: VoucherStatus.PENDING })
    status: VoucherStatus;
}
