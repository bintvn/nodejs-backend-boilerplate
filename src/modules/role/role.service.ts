import type { Repository } from 'typeorm';
import {
  createRoleSchema,
  updateRoleSchema,
  type CreateRole,
  type UpdateRole,
} from './role.schema.js';
import { BaseService } from '../../common/base.service.js';
import type { RoleEntity } from '../../db/entities/role.entity.js';

export default class RoleService extends BaseService<
  RoleEntity,
  Repository<RoleEntity>
> {
  name = 'role';

  constructor(protected readonly repository: Repository<RoleEntity>) {
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
