import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity('Benefit_Type')
export class BenefitTypeEntity {
    @PrimaryColumn({ type : 'varchar', length : 4})
    id_type!: string;

    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @Column({ type: 'boolean', default: true })
    active!: boolean;

}
