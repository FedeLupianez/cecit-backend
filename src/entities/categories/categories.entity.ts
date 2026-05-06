import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Categories')
export class CategoriesEntity {

    @PrimaryGeneratedColumn()
    id_category: number;

    @Column({ name: 'name', type: 'varchar', length: 50 })
    name: string;

    @Column({ default: true })
    active: boolean;
}
