import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Benefit_Type')
export class BenefitTypeEntity {
    @PrimaryGeneratedColumn({ name: "id_type", type: "int" })
    id_type!: number;

    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @Column({ type: 'boolean', default: true })
    active!: boolean;

}
