import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PartnersCategoriesEntity } from '../partners_categories/partners_categories.entity';

@Entity('Categories')
export class CategoriesEntity {

    @PrimaryGeneratedColumn()
    id_category: number;

    @Column({ name: 'name', type: 'varchar', length: 50 })
    name: string;

    @Column({ name: 'icon_url', type: 'varchar', length: 255 })
    icon_url: string;

    @Column({ default: true })
    active: boolean;

    @OneToMany(() => PartnersCategoriesEntity, pc => pc.category)
    partners: PartnersCategoriesEntity[];
}
