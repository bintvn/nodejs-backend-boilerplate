import type { Repository } from 'typeorm';
import type { UserRoleEntity } from '../../db/entities/user-role.entity.js';
import { BaseService } from '../../common/base.service.js';
import type UserService from '../user/user.service.js';

export default class UserRoleService extends BaseService<
  UserRoleEntity,
  Repository<UserRoleEntity>,
  { userService: UserService }
> {
  name = 'user-role';

  constructor(
    protected readonly repository: Repository<UserRoleEntity>,
    protected readonly services: { userService: UserService },
  ) {
    super(repository, services);
  }
}
