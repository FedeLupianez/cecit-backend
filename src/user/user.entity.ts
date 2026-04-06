/*
 * En los archivos .entity.ts se define la
 * estructura de la tabla
 * */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id_user: number

    @Column()
    email: string;

    @Column({ default: true })
    active: boolean;
}
