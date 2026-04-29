import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { PartnersEntity } from 'src/partners/partners.entity';
import { CategoriesEntity } from 'src/categories/categories.entity';

@Entity('partners_categories')
export class PartnersCategoriesEntity {

    @PrimaryColumn({ type: 'varchar', length: 4, name: 'id_partner' })
    id_partner: string;

    @PrimaryColumn({ type: 'int', name: 'id_category' })
    id_category: number;

    @ManyToOne(() => PartnersEntity)
    @JoinColumn({ name: 'id_partner' })
    partner: PartnersEntity;

    @ManyToOne(() => CategoriesEntity)
    @JoinColumn({ name: 'id_category' })
    category: CategoriesEntity;
}
