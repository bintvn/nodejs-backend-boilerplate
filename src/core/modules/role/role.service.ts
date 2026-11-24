import type { Repository } from 'typeorm';
import {
  createRoleSchema,
  updateRoleSchema,
  type CreateRole,
  type UpdateRole,
} from './role.schema.js';
import { BaseService } from '../../../core/base.service.js';
import type { RoleEntity } from './role.entity.js';

export default class RoleService extends BaseService<
  RoleEntity,
  Repository<RoleEntity>
> {
  name = 'role';

  constructor(readonly repository: Repository<RoleEntity>) {
    super(repository);
  }

  async create(input: CreateRole) {
    const data = createRoleSchema.parse(input);

    return await this.repository.save(
      this.repository.create({
        ...data,
        description: data.description || null,
      }),
    );
  }

  async update(id: string, input: UpdateRole) {
    return super.update(id, updateRoleSchema.parse(input));
  }
}
