import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { PartnersEntity } from 'src/entities/partners/partners.entity';
import { CategoriesEntity } from 'src/entities/categories/categories.entity';

@Entity('Partners_Categories')
export class PartnersCategoriesEntity {

    @PrimaryColumn({ type: 'varchar', length: 4, name: 'id_partner' })
    id_partner: string;

    @PrimaryColumn({ type: 'int', name: 'id_category' })
    id_category: number;

    @ManyToOne(() => PartnersEntity, { nullable: false })
    @JoinColumn({ name: 'id_partner', referencedColumnName: 'id_partner' })
    partner: PartnersEntity;

    @ManyToOne(() => CategoriesEntity, { nullable: false })
    @JoinColumn({ name: 'id_category', referencedColumnName: 'id_category' })
    category: CategoriesEntity;
}
