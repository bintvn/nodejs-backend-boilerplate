import type { QueryDeepPartialEntity, Repository } from 'typeorm';
import { BaseService } from '../../common/base.service.js';
import type { ModuleUserRoleEntity } from '../../db/entities/module-user-role.entity.js';
import { BadRequestError } from '../../common/errors.js';

export default class ModuleUserRoleService extends BaseService<
  ModuleUserRoleEntity,
  Repository<ModuleUserRoleEntity>
> {
  name = 'module-user-role';

  constructor(repository: Repository<ModuleUserRoleEntity>) {
    super(repository, { module: true, userRole: { user: true, role: true } });
  }

  async update(
    id: string,
    newData: QueryDeepPartialEntity<ModuleUserRoleEntity>,
  ) {
    if (Object.keys(newData).length === 0) {
      throw new BadRequestError('moduleId or userRoleId is required');
    }

    return super.update(id, newData);
  }
}
