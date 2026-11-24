import { Column, Entity, Index, OneToMany, type Relation } from 'typeorm';
import { BaseEntity } from '../../../db/base.entity.js';
import { ModuleUserRoleEntity } from '../module-user-role/module-user-role.entity.js';

@Entity('module')
@Index('uq_module_slug', ['slug'], { unique: true })
export class ModuleEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    name: 'slug',
    type: 'varchar',
    length: 255,
  })
  slug: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    default: null,
  })
  description: string | null;

  @OneToMany(
    () => ModuleUserRoleEntity,
    (moduleUserRole) => moduleUserRole.module,
  )
  moduleUserRoles: Relation<ModuleUserRoleEntity[]>;
}
