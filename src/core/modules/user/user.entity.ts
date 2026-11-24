import { Column, Entity, Index, OneToMany, type Relation } from 'typeorm';
import { BaseEntity } from '../../base.entity.js';
import { UserRoleEntity } from '../user-role/user-role.entity.js';
import { SessionEntity } from '../session/session.entity.js';
import { PostEntity } from '../../../modules/post/post.entity.js';

@Entity('core__user')
@Index('UQ_core__user_email', ['email'], { unique: true })
export class UserEntity extends BaseEntity {
  @Column({
    name: 'is_email_verified',
    type: 'boolean',
    default: false,
  })
  isEmailVerified: boolean;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions?: Relation<SessionEntity[]>;

  @OneToMany(() => UserRoleEntity, (role) => role.user)
  userRoles?: Relation<UserRoleEntity[]>;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts?: Relation<PostEntity[]>;
}
