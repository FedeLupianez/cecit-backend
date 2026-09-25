import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  BeforeInsert,
  Index,
} from 'typeorm';
import { AccountsEntity } from '../accounts/accounts.entity';
import { BenefitsEntity } from '../benefits/benefits.entity';

export enum VoucherStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
}

@Entity('Vouchers')
export class VouchersEntity {
  @PrimaryColumn({ type: 'varchar', length: 6 })
  token!: string;

  @Index()
  @Column({ type: 'varchar', length: 4, name: 'id_account' })
  id_account!: string;

  @ManyToOne(() => AccountsEntity, { nullable: false })
  @JoinColumn({ name: 'id_account', referencedColumnName: 'id_account' })
  account!: AccountsEntity;

  @Index()
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

  @Index()
  @Column({ type: 'enum', enum: VoucherStatus, default: VoucherStatus.PENDING })
  status!: VoucherStatus;

  @BeforeInsert()
  setDate() {
    this.application_date = new Date();
    this.limit_date = new Date();
    this.limit_date.setDate(this.application_date.getDate() + 7);
  }
}
