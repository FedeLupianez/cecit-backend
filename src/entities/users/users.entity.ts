/*
 * En los archivos .entity.ts se define la
 * estructura de la tabla
 * */
import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('Users')
export class UsersEntity {
    @PrimaryColumn({ length: 4, type: 'varchar', name: 'id_user' })
    id_user: string;

    @Index()
    @Column({ length: 50, type: 'varchar', name: 'email', nullable: true })
    email: string;

    @Column({ length: 255, type: 'varchar', name: 'password', nullable: true })
    password: string;

    @Column({ length: 50, type: 'varchar', name: 'name' })
    name: string;

    @Column({ length: 50, type: 'varchar', name: 'lastname' })
    lastname: string;

    @Index()
    @Column({ length: 8, type: 'varchar', name: 'dni' })
    dni: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    last_activity: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

}
