import {
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
    JoinColumn,
    BeforeInsert,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { BenefitsEntity } from '../benefits/benefits.entity';

export enum VoucherStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    EXPIRED = 'EXPIRED',
}

@Entity('Vouchers')
export class VouchersEntity {
    @PrimaryColumn({ type: 'varchar', length: 6 })
    token!: string;

    @Column({ type: 'varchar', length: 4 })
    id_user!: string;

    @ManyToOne(() => UsersEntity, { nullable: false })
    @JoinColumn({ name: 'id_user', referencedColumnName: 'id_user' })
    user!: UsersEntity;

    @Column({ type: 'varchar', length: 4 })
    id_benefit!: string;

    @ManyToOne(() => BenefitsEntity, { nullable: false })
    @JoinColumn({ name: 'id_benefit', referencedColumnName: 'id_benefit' })
    benefit!: BenefitsEntity;

    @Column({ type: 'date' })
    application_date!: Date;

    @Column({ default: null, type: 'date' })
    delivery_date!: Date;

    @Column({ type: 'date', name: 'limit_date', default: '2026-05-11' })
    limit_date!: Date;

    @Column({ type: 'enum', enum: VoucherStatus, default: VoucherStatus.PENDING })
    status!: VoucherStatus;

    @BeforeInsert()
    setDate() {
        this.application_date = new Date();
        this.limit_date = new Date();
        this.limit_date.setDate(this.application_date.getDate() + 7);
    }
}
