import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { BaseEntity } from '../../../db/base.entity.js';
import { UserEntity } from '../user/user.entity.js';

@Entity('session')
@Index('uq_session_refresh_token_hash', ['refreshTokenHash'], {
  unique: true,
})
export class SessionEntity extends BaseEntity {
  @Column({
    name: 'expires_at',
    type: 'datetime',
    precision: 6,
  })
  expiresAt: Date;

  @Column({
    name: 'refresh_token_hash',
    type: 'varchar',
    length: 64,
  })
  refreshTokenHash: string;

  @Column({
    name: 'user_agent',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  userAgent: string | null;

  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipAddress: string | null;

  @Column({
    name: 'last_used_at',
    type: 'datetime',
    nullable: true,
  })
  lastUsedAt: Date | null;

  @Column({
    name: 'revoked_at',
    type: 'datetime',
    nullable: true,
  })
  revokedAt: Date | null;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_session_user_id',
  })
  user: Relation<UserEntity>;
}
