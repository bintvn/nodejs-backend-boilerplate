import type { Repository } from 'typeorm';
import type { UserRoleEntity } from './user-role.entity.js';
import { BaseService } from '../../base.service.js';

export default class UserRoleService extends BaseService<
  UserRoleEntity,
  Repository<UserRoleEntity>
> {
  name = 'user-role';

  constructor(readonly repository: Repository<UserRoleEntity>) {
    super(repository);
  }
}
