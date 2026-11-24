import { Entity, Column, Index, OneToMany, type Relation } from 'typeorm';
import { UserRoleEntity } from '../user-role/user-role.entity.js';
import { AccessControlEntity } from '../access-control/access-control.entity.js';
import { BaseEntity } from '../../base.entity.js';

@Entity('core__role')
@Index('UQ_core__role_slug', ['slug'], { unique: true })
export class RoleEntity extends BaseEntity {
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

  @OneToMany(() => UserRoleEntity, (role) => role.role)
  userRoles: Relation<UserRoleEntity[]>;

  @OneToMany(() => AccessControlEntity, (accessControl) => accessControl.role)
  roleAccesses: Relation<AccessControlEntity[]>;
}
