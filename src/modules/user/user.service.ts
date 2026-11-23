import type { Repository } from 'typeorm';
import type { UserEntity } from '../../db/entities/user.entity.js';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUser,
  type UpdateUser,
} from './user.schema.js';
import { BaseService } from '../../common/base.service.js';
import passwordUtil from '../../utils/password.util.js';

export default class UserService extends BaseService<
  UserEntity,
  Repository<UserEntity>
> {
  name = 'user';

  constructor(protected readonly repository: Repository<UserEntity>) {
    super(repository);
  }

  async create(input: CreateUser) {
    const data = createUserSchema.parse(input);
    const passwordHash = await passwordUtil.hash(data.password);

    return await this.repository.save(
      this.repository.create({
        name: data.name,
        email: data.email,
        passwordHash,
      }),
    );
  }

  async update(id: string, input: UpdateUser) {
    const data = updateUserSchema.parse(input);
    const partial: Partial<UserEntity> = {};

    if (data.name !== undefined) partial.name = data.name;
    if (data.email !== undefined) partial.email = data.email;
    if (data.password !== undefined)
      partial.passwordHash = await passwordUtil.hash(data.password);

    return super.update(id, partial);
  }
}
