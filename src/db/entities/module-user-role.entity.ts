import { Entity, JoinColumn, ManyToOne, Unique, type Relation } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { ModuleEntity } from './module.entity.js';
import { UserRoleEntity } from './user-role.entity.js';

@Entity('module__user_role')
@Unique('unique_module_user_role', ['module', 'userRole'])
export class ModuleUserRoleEntity extends BaseEntity {
  @ManyToOne(() => ModuleEntity, (module) => module.moduleUserRoles, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'module_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_module_role_module_id',
  })
  module: Relation<ModuleEntity>;

  @ManyToOne(() => UserRoleEntity, (userRole) => userRole.id, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'user_role_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_module__user_role_id',
  })
  userRole: Relation<UserRoleEntity>;
}
