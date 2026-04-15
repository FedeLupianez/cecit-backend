/*
 * En los archivos .entity.ts se define la
 * estructura de la tabla
 * */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id_user' })
    id_user: number

    @Column({ length: 50, type: 'varchar', name: 'email' })
    email: string;

    @Column({ length: 255, type: 'varchar', name: 'password' })
    password: string;

    @Column({ length: 50, type: 'varchar', name: 'name' })
    name: string;

    @Column({ length: 50, type: 'varchar', name: 'lastname' })
    lastname: string;

    @Column({ length: 10, type: 'varchar', name: 'dni' })
    dni: string;

    @Column({ type: 'date' })
    last_activity: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

}
