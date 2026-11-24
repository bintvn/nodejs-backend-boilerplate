import { Column, Entity, Index, OneToMany, type Relation } from 'typeorm';
import { BaseEntity } from '../../base.entity.js';
import { AccessControlEntity } from '../access-control/access-control.entity.js';

@Entity('module')
@Index('uq_module_code', ['code'], { unique: true })
export class ModuleEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    name: 'code',
    type: 'varchar',
    length: 255,
  })
  code: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    default: null,
  })
  description: string | null;

  @Column({
    name: 'route_path',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  routePath: string | null;

  @OneToMany(() => AccessControlEntity, (accessControl) => accessControl.module)
  moduleAccesses: Relation<AccessControlEntity[]>;
}
