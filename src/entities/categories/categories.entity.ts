import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { PartnersEntity } from '../partners/partners.entity';

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

  @ManyToMany(() => PartnersEntity, (p) => p.categories)
  partners: PartnersEntity[];
}
