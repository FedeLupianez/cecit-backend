
import { PartnersEntity } from 'src/entities/partners/partners.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('PartnersAdmins')
export class PartnersAdminsEntity {
    @PrimaryColumn({ type: 'varchar', length: 4, name: 'id_p_admin' })
    id_p_admin: string;

    @ManyToOne(() => PartnersEntity, (partner) => partner.id_partner)
    @JoinColumn({ name: 'id_partner', referencedColumnName: 'id_partner' })
    partner: PartnersEntity;

    @Column({ type: 'varchar', length: 50, name: 'email' })
    email !: string;

    @Column({ type: 'varchar', length: 255, name: 'password' })
    password !: string;

    @Column({ type: 'boolean', name: 'active' })
    active: boolean;

}
