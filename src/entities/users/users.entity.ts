/*
 * En los archivos .entity.ts se define la
 * estructura de la tabla
 * */
import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('Users')
export class UsersEntity {
    @PrimaryColumn({ length: 4, type: 'varchar', name: 'id_user' })
    id_user: string;

    @Column({ length: 50, type: 'varchar', name: 'name' })
    name: string;

    @Column({ length: 50, type: 'varchar', name: 'lastname' })
    lastname: string;

    @Index()
    @Column({ length: 8, type: 'varchar', name: 'dni' })
    dni: string;
}
