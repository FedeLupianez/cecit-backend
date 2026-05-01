import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UsersEntity } from 'src/entities/users/users.entity';
import { BenefitsEntity } from 'src/entities/benefits/benefits.entity';

@Entity()
export class VoucherEntity {
    @PrimaryGeneratedColumn()
    id_voucher: number

    @ManyToOne(() => UsersEntity)
    id_user: UsersEntity;

    @ManyToOne(() => BenefitsEntity)
    id_benefit: BenefitsEntity;

    @Column({ type: 'varchar', length: 6 })
    token: string;

    @Column()
    application_date: Date;

    @Column({ default: null })
    delibery_date: Date;

    @Column()
    status: Enumerator;
}
