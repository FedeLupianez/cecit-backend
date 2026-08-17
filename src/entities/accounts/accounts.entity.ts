import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { AccountRole } from './accounts.dto';
import { hash } from 'argon2';
import { UsersEntity } from '../users/users.entity';

@Entity('Accounts')
export class AccountsEntity {
    @PrimaryColumn({ length: 4, type: 'varchar', name: 'id_user' })
    id_user: string;

    @OneToOne(() => UsersEntity)
    @JoinColumn({ name: 'id_user', referencedColumnName: 'id_user' })
    user: UsersEntity;

    @Index()
    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
        name: 'email',
        unique: true,
    })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'password' })
    password: string;

    @Index()
    @Column({
        type: 'enum',
        enum: AccountRole,
        default: AccountRole.USER,
        nullable: false,
    })
    role: AccountRole;

    @Column({
        type: 'timestamp',
        name: 'last_activity',
        default: () => 'CURRENT_TIMESTAMP',
    })
    last_activity: Date;

    @Column({ type: 'boolean', name: 'active', default: true })
    active: boolean;

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password);
    }
}
