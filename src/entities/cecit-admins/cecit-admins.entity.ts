import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('CecitAdmins')
export class CecitAdminsEntity {
    @PrimaryColumn({ type: 'varchar', length: 4 })
    id_c_admin: string;

    @Index()
    @Column({ type: 'varchar', length: 50, name: 'email' })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'boolean' })
    active: boolean;
};
