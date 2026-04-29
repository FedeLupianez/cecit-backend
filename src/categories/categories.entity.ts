import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class CategoriesEntity {

    @PrimaryGeneratedColumn()
    id_category: number;

    @Column({ name: 'name', type: 'varchar', length: 50 })
    name: string;

    @Column({ default: true })
    active: boolean;
}
