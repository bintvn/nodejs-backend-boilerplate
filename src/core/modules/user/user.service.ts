import type { EntityManager, Repository } from 'typeorm';
import type { UserEntity } from './user.entity.js';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUser,
  type UpdateUser,
} from './user.schema.js';
import { BaseService } from '../../../core/base.service.js';
import passwordUtil from '../../utils/password.util.js';
import { RoleEntity } from '../role/role.entity.js';
import { UserRoleEntity } from '../user-role/user-role.entity.js';
import { NotFoundError } from '../../../core/errors.js';
import type { UserServiceDependencies } from './index.js';

export default class UserService extends BaseService<
  UserEntity,
  Repository<UserEntity>
> {
  name = 'user';

  constructor(
    readonly repository: Repository<UserEntity>,
    readonly dependencies: UserServiceDependencies,
  ) {
    super(repository);
  }

  async create(input: CreateUser, manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(this.repository.target)
      : this.repository;
    const userRoleRepository = manager
      ? manager.getRepository(UserRoleEntity)
      : repository.manager.getRepository(UserRoleEntity);
    const data = createUserSchema.parse(input);
    const role = await this.dependencies.roleService.get(input.roleId, manager);

    if (!role) throw new Error('Role with slug "user" not found');

    const userRecord = repository.create({
      name: data.name,
      email: data.email,
      passwordHash: await passwordUtil.hash(data.password),
    });

    const user = await repository.save(userRecord);

    const userRoleRecord = userRoleRepository.create({
      role,
      user,
    });

    const userRole = await userRoleRepository.save(userRoleRecord);

    if (!userRole.user) throw new NotFoundError('User not found');

    return (await repository.findOne({
      where: {
        id: userRole.user.id,
      },
      relations: {
        userRoles: {
          role: true,
        },
      },
    })) as UserEntity & {
      userRoles: (UserRoleEntity & {
        role: RoleEntity;
      })[];
    };
  }

  async update(id: string, input: UpdateUser) {
    const data = updateUserSchema.parse(input);
    const partial: Partial<UserEntity> = {};

    if (data.name !== undefined) partial.name = data.name;
    if (data.email !== undefined) partial.email = data.email;
    if (data.password !== undefined)
      partial.passwordHash = await passwordUtil.hash(data.password);

    if (Object.keys(partial).length > 0) {
      await this.repository.update(id, partial);

      return true;
    }

    return false;
  }
}
