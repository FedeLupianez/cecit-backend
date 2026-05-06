import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Benefit_Type')
export class BenefitTypeEntity {
    @PrimaryGeneratedColumn()
    id_type!: number;

    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @Column({ type: 'boolean', default: true })
    active!: boolean;

}
