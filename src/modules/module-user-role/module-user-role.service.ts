import type { DeepPartial, Repository } from 'typeorm';
import { BaseService } from '../../common/base.service.js';
import type { ModuleUserRoleEntity } from '../../db/entities/module-user-role.entity.js';
import type UserRoleService from '../user-role/user-role.service.js';
import type ModuleService from '../modules/module.service.js';
import { BadRequestError } from '../../common/errors.js';

export default class ModuleUserRoleService extends BaseService<
  ModuleUserRoleEntity,
  Repository<ModuleUserRoleEntity>
> {
  name = 'module-role';

  constructor(
    protected readonly repository: Repository<ModuleUserRoleEntity>,
    protected readonly services: {
      userRole: UserRoleService;
      module: ModuleService;
    },
  ) {
    super(repository);
  }

  async update(id: string, newData: DeepPartial<ModuleUserRoleEntity>) {
    const moduleId = newData.module?.id;
    const roleId = newData.userRole?.id;

    if (!moduleId && !roleId)
      throw new BadRequestError('moduleId or roleId is required');

    const result = await this.repository.update(id, newData);

    if (!result.affected)
      throw new BadRequestError(`${this.name} with ID ${id} not found`);

    return await this.get(id);
  }
}
