import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

export enum BenefitStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
}

@Entity('benefit')
export class BenefitEntity {
    @PrimaryGeneratedColumn()
    id_benefit!: number;

    @ManyToOne(() => CecitAdmin)
    @JoinColumn({ name: 'id_admin' })
    admin: CecitAdmin;

    @ManyToOne(() => Partner)
    @JoinColumn({ name: 'id_partner' })
    partner: Partner;

    @Column({ type: 'date' })
    date_entered!: Date;

    @Column({ type: 'date' })
    start_date!: Date;

    @Column({ type: 'date' })
    end_date!: Date;

    @Column({ length: 100 })
    image!: string;

    @Column()
    title!: string

    @Column({ length: 500 })
    description!: string

    @Column({ type: 'enum', enum: BenefitStatus, default: BenefitStatus.ACTIVE, })
    status!: BenefitStatus;

    @ManyToOne(() => BenefitType)
    @JoinColumn({ name: 'id_type' })
    type!: BenefitType;

    @Column()
    coupons!: number;

}

