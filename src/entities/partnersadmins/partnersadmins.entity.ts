
import { AccountsEntity } from '../accounts/accounts.entity';
import { PartnersEntity } from '../partners/partners.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('Partners_Admins')
export class PartnersAdminsEntity {
    @PrimaryColumn({ type: 'varchar', length: 4, name: 'id_user' })
    id_user: string;

    @PrimaryColumn({ type: 'varchar', length: 4, name: 'id_partner' })
    id_partner: string;

    @ManyToOne(() => PartnersEntity, { nullable: false })
    @JoinColumn({ name: 'id_partner', referencedColumnName: 'id_partner' })
    partner: PartnersEntity;

    @ManyToOne(() => AccountsEntity, { nullable: false })
    @JoinColumn({ name: 'id_user', referencedColumnName: 'id_user' })
    account: AccountsEntity;
}
