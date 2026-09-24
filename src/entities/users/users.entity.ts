/*
 * En los archivos .entity.ts se define la
 * estructura de la tabla
 * */
import { Entity, Column, PrimaryColumn, Index, ManyToMany } from 'typeorm';
import { PartnersEntity } from '../partners/partners.entity';

@Entity('Users')
export class UsersEntity {
    @PrimaryColumn({ length: 4, type: 'varchar', name: 'id_user' })
    id_user: string;

    @Column({ length: 50, type: 'varchar', name: 'name' })
    name: string;

    @Column({ length: 50, type: 'varchar', name: 'lastname' })
    lastname: string;

    @Index()
    @Column({ length: 11, type: 'varchar', name: 'dni' })
    dni: string;

    @ManyToMany(() => PartnersEntity, (p) => p.employees)
    partners: PartnersEntity[];
}
