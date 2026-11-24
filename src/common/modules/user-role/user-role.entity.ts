import { Entity, JoinColumn, ManyToOne, type Relation } from 'typeorm';
import { UserEntity } from '../user/user.entity.js';
import { BaseEntity } from '../../../db/base.entity.js';
import { RoleEntity } from '../role/role.entity.js';

@Entity('user_role')
export class UserRoleEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.userRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_user_role_user_id',
  })
  user?: Relation<UserEntity>;

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
  role?: Relation<RoleEntity>;
}
