
import { PartnersEntity } from 'src/partners/partners.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class PartnersAdminsEntity {
    @PrimaryColumn({ type: 'varchar', length: 4, name: 'id_p_admin' })
    id_p_admin: string;

    @ManyToOne(() => PartnersEntity)
    id_partner: string;

    @Column({ type: 'varchar', length: 50, name: 'email' })
    email !: string;

    @Column({ type: 'varchar', length: 255, name: 'password' })
    password !: string;

    @Column({ type: 'boolean', name: 'active' })
    active: boolean;

}
