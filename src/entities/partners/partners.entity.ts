import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { Directions } from './directions.entity';
import { CategoriesEntity } from '../categories/categories.entity';

@Entity('Partners')
export class PartnersEntity {
    @PrimaryColumn({ type: 'varchar', length: 4, name: 'id_partner' })
    id_partner: string;

    @Column({ type: 'varchar', length: 50, name: 'name' })
    name!: string;

    @Column({ type: 'varchar', length: 2048, name: 'logo' })
    logo: string;

    @Column({ type: 'varchar', length: 4, name: 'id_owner' })
    id_owner: string;

    @OneToOne(() => UsersEntity, { nullable: false })
    @JoinColumn({ name: 'id_owner', referencedColumnName: 'id_user' })
    owner: UsersEntity;

    @Column({ type: 'boolean', name: 'active', default: true })
    active: boolean;

    @ManyToMany(() => CategoriesEntity, (c) => c.partners)
    @JoinTable({
        name: 'Partners_Categories',
        joinColumn: { name: 'id_partner', referencedColumnName: 'id_partner' },
        inverseJoinColumn: { name: 'id_category', referencedColumnName: 'id_category' },
    })
    categories: CategoriesEntity[];

    @OneToMany(() => Directions, (d) => d.partner)
    directions: Directions[];

    @ManyToMany(() => UsersEntity, (u) => u.partners)
    @JoinTable({
        name: 'Employees',
        joinColumn: { name: 'id_partner', referencedColumnName: 'id_partner' },
        inverseJoinColumn: { name: 'id_user', referencedColumnName: 'id_user' },
    })
    employees: UsersEntity[];
}
