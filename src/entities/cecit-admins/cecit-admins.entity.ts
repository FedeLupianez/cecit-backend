import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CecitAdminsEntity {
    @PrimaryColumn({ type: 'varchar', length: 4 })
    id_c_admin: string;

    @Column({ type: 'varchar', length: 50 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'boolean' })
    active: boolean;
};
