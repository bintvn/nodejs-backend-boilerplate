import { Entity, Column, Index, OneToMany, type Relation } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { UserRoleEntity } from './user-role.entity.js';

@Entity('role')
@Index('uq_role_slug', ['slug'], { unique: true })
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

  @OneToMany(() => UserRoleEntity, (role) => role.user)
  userRoles: Relation<UserRoleEntity>;
}
