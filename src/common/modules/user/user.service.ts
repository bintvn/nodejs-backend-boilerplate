import type { Repository } from 'typeorm';
import type { UserEntity } from './user.entity.js';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUser,
  type UpdateUser,
} from './user.schema.js';
import { BaseService } from '../../base.service.js';
import passwordUtil from '../../../utils/password.util.js';
import { RoleEntity } from '../role/role.entity.js';
import { UserRoleEntity } from '../user-role/user-role.entity.js';
import { NotFoundError } from '../../errors.js';

export default class UserService extends BaseService<
  UserEntity,
  Repository<UserEntity>
> {
  name = 'user';

  constructor(readonly repository: Repository<UserEntity>) {
    super(repository);
  }

  async create(input: CreateUser) {
    const data = createUserSchema.parse(input);
    const role = input.role;
    const userRoleRepository =
      this.repository.manager.getRepository(UserRoleEntity);

    if (!role) throw new Error('Role with slug "user" not found');

    const userRole = await userRoleRepository.save(
      userRoleRepository.create({
        role,
        user: await this.repository.save(
          this.repository.create({
            name: data.name,
            email: data.email,
            passwordHash: await passwordUtil.hash(data.password),
          }),
        ),
      }),
    );

    if (!userRole.user) throw new NotFoundError('User not found');

    return (await this.repository.findOne({
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
