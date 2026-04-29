import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Partner } from '../partners/partner.entity';
import { Category } from '../categories/category.entity';

@Entity('partners_categories')
export class PartnersCategories {

  @PrimaryColumn()
  id_partner: number;

  @PrimaryColumn()
  id_category: number;

  @ManyToOne(() => Partner)
  @JoinColumn({ name: 'id_partner' })
  partner: Partner;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'id_category' })
  category: Category;
}