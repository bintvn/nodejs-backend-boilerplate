import { Entity, JoinColumn, ManyToOne, type Relation } from 'typeorm';
import { UserEntity } from './user.entity.js';
import { BaseEntity } from './base.entity.js';
import { RoleEntity } from './role.entity.js';

@Entity('user_role')
export class UserRoleEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.userRoles, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_user_role_user_id',
  })
  user: Relation<UserEntity>;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_user_role_role_id',
  })
  role: Relation<RoleEntity>;
}
