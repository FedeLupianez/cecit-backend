import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { CecitAdminsEntity } from 'src/entities/cecit-admins/cecit-admins.entity';
import { BenefitTypeEntity } from 'src/entities/benefit_type/benefit_type.entity';
import { PartnersEntity } from 'src/entities/partners/partners.entity';

export enum BenefitStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
}

@Entity('benefits')
export class BenefitsEntity {
    @PrimaryColumn({ type: 'varchar', length: 4 })
    id_benefit!: number;

    @ManyToOne(() => CecitAdminsEntity)
    @JoinColumn({ name: 'id_admin' })
    admin: CecitAdminsEntity;

    @ManyToOne(() => PartnersEntity)
    @JoinColumn({ name: 'id_partner' })
    partner: PartnersEntity;

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

    @ManyToOne(() => BenefitTypeEntity)
    @JoinColumn({ name: 'id_type' })
    type!: BenefitTypeEntity;

    @Column()
    coupons!: number;

}

