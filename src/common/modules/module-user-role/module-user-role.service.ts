import type { QueryDeepPartialEntity, Repository } from 'typeorm';
import { BaseService } from '../../base.service.js';
import type { ModuleUserRoleEntity } from './module-user-role.entity.js';
import { BadRequestError } from '../../errors.js';

export default class ModuleUserRoleService extends BaseService<
  ModuleUserRoleEntity,
  Repository<ModuleUserRoleEntity>
> {
  name = 'module-user-role';

  constructor(readonly repository: Repository<ModuleUserRoleEntity>) {
    super(repository);
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
