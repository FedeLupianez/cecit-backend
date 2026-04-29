/*
 * En los archivos .entity.ts se define la
 * estructura de la tabla
 * */
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryColumn({ length: 36, type: 'varchar', name: 'uuid' })
    uuid: string;

    @Column({ length: 50, type: 'varchar', name: 'email' })
    email: string;

    @Column({ length: 255, type: 'varchar', name: 'password' })
    password: string;

    @Column({ length: 50, type: 'varchar', name: 'name' })
    name: string;

    @Column({ length: 50, type: 'varchar', name: 'lastname' })
    lastname: string;

    @Column({ length: 8, type: 'varchar', name: 'dni' })
    dni: string;

    @Column({ type: 'date' })
    last_activity: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

}
