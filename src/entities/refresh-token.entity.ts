import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsersEntity } from './users/users.entity';

@Entity('RefreshTokens')
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn("uuid", { name: "id_token" })
    id_token: string;

    @Column({ type: 'varchar', length: 255 })
    token_hash: string;

    @ManyToOne(() => UsersEntity)
    @JoinColumn({ name: 'id_user', referencedColumnName: 'id_user' })
    user_id: string;

    @Column({ type: 'datetime' })
    expires_at: Date;

    @Column({ type: 'boolean', default: false })
    revoked: boolean;

    @CreateDateColumn()
    created_at: Date;
}
