import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  type Relation,
} from 'typeorm';
import { RoleEntity } from '../role/role.entity.js';
import { ModuleEntity } from '../modules/module.entity.js';
import { BaseEntity } from '../../base.entity.js';

@Entity('core__access_control')
@Unique('UQ_role_module', ['role', 'module'])
export class AccessControlEntity extends BaseEntity {
  @Column({
    name: 'can_read',
    type: 'boolean',
    default: false,
  })
  canRead: boolean;

  @Column({
    name: 'can_create',
    type: 'boolean',
    default: false,
  })
  canCreate: boolean;

  @Column({
    name: 'can_update',
    type: 'boolean',
    default: false,
  })
  canUpdate: boolean;

  @Column({
    name: 'can_delete',
    type: 'boolean',
    default: false,
  })
  canDelete: boolean;

  @ManyToOne(() => RoleEntity, (role) => role.roleAccesses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_access_control_role_id',
  })
  role?: Relation<RoleEntity>;

  @ManyToOne(() => ModuleEntity, (module) => module.moduleAccesses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'module_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_access_control_module_id',
  })
  module?: Relation<ModuleEntity>;
}
