import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { BenefitTypeEntity } from '../benefit_type/benefit_type.entity';
import { PartnersEntity } from '../partners/partners.entity';
import { AccountsEntity } from '../accounts/accounts.entity';

export enum BenefitStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
}

@Entity('Benefits')
export class BenefitsEntity {
    @PrimaryColumn({ type: 'varchar', length: 4 })
    id_benefit !: string;

    @Column({ type: 'varchar', length: 4 })
    id_admin !: string;

    @ManyToOne(() => AccountsEntity, { nullable: false })
    @JoinColumn({ name: 'id_admin', referencedColumnName: 'id_user' })
    admin !: AccountsEntity;

    @Column({ type: 'varchar', length: 4 })
    id_partner !: string;

    @ManyToOne(() => PartnersEntity, { nullable: false })
    @JoinColumn({ name: 'id_partner', referencedColumnName: 'id_partner' })
    partner !: PartnersEntity;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    date_entered !: Date;

    @Column({ type: 'date' })
    start_date !: Date;

    @Column({ type: 'date' })
    end_date !: Date;

    @Column({ type: 'varchar', length: 100 })
    image !: string;

    @Column({ type: 'varchar', length: 100 })
    title !: string

    @Column({ type: 'varchar', length: 500 })
    description !: string

    @Column({ type: 'enum', enum: BenefitStatus, default: BenefitStatus.ACTIVE, })
    status !: BenefitStatus;

    @Column({ type: 'int' })
    id_type !: number;

    @ManyToOne(() => BenefitTypeEntity, { nullable: false })
    @JoinColumn({ name: 'id_type', referencedColumnName: 'id_type' })
    type !: BenefitTypeEntity;

    @Column({ type: 'int', name: 'max_coupons' })
    max_coupons!: number;

    @Column({ type: 'int' })
    coupons !: number;

}

