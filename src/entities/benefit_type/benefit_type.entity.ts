import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('benefit_type')
export class BenefitTypeEntity {
    @PrimaryGeneratedColumn()
    id_type!: number;

    @Column({length: 50})
    name!: string;

    @Column({default: true})
    active!: boolean;

}
