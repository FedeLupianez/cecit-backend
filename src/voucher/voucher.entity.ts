/*
* Entidad voucher
*/
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class VoucherEntity {
    @PrimaryGeneratedColumn()
    id_voucher: number

    @Column()
    id_user: number;

    @Column()
    id_benefit: number;

    @Column()
    token: string;

    @Column()
    application_date: Date;

    @Column({ default: null })
    delibery_date: Date;

    @Column()
    status: Enumerator;
}