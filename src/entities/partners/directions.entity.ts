import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PartnersEntity } from './partners.entity';

@Entity('Directions')
export class Directions {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id_direction' })
    id_direction: number;

    @Column({ type: 'varchar', length: 4, name: 'id_partner' })
    id_partner: string;

    @ManyToOne(() => PartnersEntity, (partner) => partner.directions, { nullable: false })
    @JoinColumn({ name: 'id_partner', referencedColumnName: 'id_partner' })
    partner: PartnersEntity;

    @Column({ type: 'varchar', length: 150, nullable: false })
    direction: string;
}
