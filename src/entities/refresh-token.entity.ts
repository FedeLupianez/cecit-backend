import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { AccountsEntity } from './accounts/accounts.entity';
import { hash } from 'argon2';

@Entity('RefreshTokens')
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn("uuid", { name: "id_token" })
    id_token: string;

    @Column({ type: 'varchar', length: 255 })
    token_hash: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    email: string;

    @ManyToOne(() => AccountsEntity, { nullable: false })
    @JoinColumn({ name: 'email', referencedColumnName: 'email' })
    account: AccountsEntity;

    @Column({ type: 'datetime' })
    expires_at: Date;

    @Column({ type: 'boolean', default: false })
    revoked: boolean;

    @CreateDateColumn()
    created_at: Date;

    @BeforeInsert()
    setDate() {
        this.expires_at = new Date()
        this.expires_at.setDate(this.expires_at.getDate() + Number(process.env.REFRESH_TOKEN_EXPIRES));
    }

    @BeforeInsert()
    async hashToken() {
        this.token_hash = await hash(this.token_hash);
    }
}
