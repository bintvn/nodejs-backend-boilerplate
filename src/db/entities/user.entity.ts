import { Column, Entity, Index, OneToMany, type Relation } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { UserRoleEntity } from './user-role.entity.js';

@Entity('user')
@Index('uq_user_email', ['email'], { unique: true })
export class UserEntity extends BaseEntity {
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
    name: 'password',
    type: 'varchar',
    length: 255,
    select: false,
  })
  passwordHash: string;

  @OneToMany(() => UserRoleEntity, (role) => role.user)
  userRoles: Relation<UserRoleEntity>;
}
