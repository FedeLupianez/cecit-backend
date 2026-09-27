import {
    Entity,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    Index,
    PrimaryColumn,
} from 'typeorm';
import { AccountsEntity } from './accounts/accounts.entity';
import { createHash } from 'node:crypto';

@Entity('RefreshTokens')
export class RefreshTokenEntity {
    @PrimaryColumn({ type: 'binary', length: 32 })
    token_hash: Buffer;

    @Index()
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
        this.expires_at = new Date();
        const days = Number(process.env.REFRESH_TOKEN_EXPIRES) || 7;
        this.expires_at.setDate(this.expires_at.getDate() + days);
    }

    hashToken(token: string) {
        this.token_hash = createHash('sha256')
            .update(token).digest();
    }

    async change_token(newToken: string): Promise<boolean> {
        if (!newToken) return false;
        this.token_hash = createHash('sha256').update(newToken).digest();
        this.setDate();
        this.revoked = false;
        return true;
    }
}
