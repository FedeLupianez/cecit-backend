import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Index } from 'typeorm';
import { CecitAdminsEntity } from '../cecit-admins/cecit-admins.entity';
import { BenefitTypeEntity } from '../benefit_type/benefit_type.entity';
import { PartnersEntity } from '../partners/partners.entity';

export enum BenefitStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
}

@Entity('Benefits')
export class BenefitsEntity {
    @PrimaryColumn({ type: 'varchar', length: 4 })
    id_benefit!: string;

    @Index()
    @Column({ type: 'varchar', length: 4 })
    id_admin !: string;

    @Index()
    @Column({ type: 'varchar', length: 4 })
    id_partner !: string;

    @ManyToOne(() => CecitAdminsEntity, { nullable: false })
    @JoinColumn({ name: 'id_admin', referencedColumnName: 'id_c_admin' })
    admin: CecitAdminsEntity;

    @ManyToOne(() => PartnersEntity, { nullable: false })
    @JoinColumn({ name: 'id_partner', referencedColumnName: 'id_partner' })
    partner: PartnersEntity;

    @Column({ type: 'date' })
    date_entered!: string;

    @Column({ type: 'date' })
    start_date!: string;

    @Column({ type: 'date' })
    end_date!: string;

    @Column({ type: 'varchar', length: 100 })
    image!: string;

    @Column({ type: 'varchar', length: 100 })
    title!: string

    @Column({ type: 'varchar', length: 500 })
    description!: string

    @Column({ type: 'enum', enum: BenefitStatus, default: BenefitStatus.ACTIVE, })
    status!: BenefitStatus;

    @Column({ type: 'int' })
    id_type: number;

    @ManyToOne(() => BenefitTypeEntity, { nullable: false })
    @JoinColumn({ name: 'id_type', referencedColumnName: 'id_type' })
    type!: BenefitTypeEntity;

    @Column({ type: 'int' })
    coupons!: number;

}

