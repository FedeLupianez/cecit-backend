import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CecitAdminsEntity {
    @PrimaryGeneratedColumn()
    id_c_admin: number;

    @Column({ type: 'varchar', length: 50 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'boolean' })
    active: boolean;
};
