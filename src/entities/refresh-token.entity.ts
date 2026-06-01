import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('RefreshTokens')
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn("uuid", { name: "id_token" })
    id_token: string;

    @Index()
    @Column({ type: 'varchar', length: 255 })
    token_hash: string;

    @Column({ type: 'datetime' })
    expires_at: Date;

    @Column({ type: 'boolean', default: false })
    revoked: boolean;

    @CreateDateColumn()
    created_at: Date;
}
