import type { Repository } from 'typeorm';
import type { UserRoleEntity } from '../../db/entities/user-role.entity.js';
import { BaseService } from '../../common/base.service.js';

export default class UserRoleService extends BaseService<
  UserRoleEntity,
  Repository<UserRoleEntity>
> {
  name = 'user-role';

  constructor(repository: Repository<UserRoleEntity>) {
    super(repository, { user: true, role: true });
  }
}
