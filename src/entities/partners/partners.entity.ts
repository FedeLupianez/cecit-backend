
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { PartnersCategoriesEntity } from '../partners_categories/partners_categories.entity';
import { UsersEntity } from '../users/users.entity';

@Entity('Partners')
export class PartnersEntity {
    @PrimaryColumn({ type: 'varchar', length: 4, name: 'id_partner' })
    id_partner: string;

    @Column({ type: 'varchar', length: 50, name: 'name' })
    name !: string;

    @Column({ type: 'varchar', length: 255, name: 'logo' })
    logo: string;

    @Column({ type: 'varchar', length: 255, name: 'direction' })
    direction: string;

    @Column({ type: 'varchar', length: 4, name: 'id_owner' })
    id_owner: string;

    @OneToOne(() => UsersEntity, { nullable: false })
    @JoinColumn({ name: 'id_owner', referencedColumnName: 'id_user' })
    owner: UsersEntity;

    @Column({ type: 'boolean', name: 'active', default: true })
    active: boolean;

    @OneToMany(() => PartnersCategoriesEntity, pc => pc.partner)
    categories: PartnersCategoriesEntity[];
}
