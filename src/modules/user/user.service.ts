import { hash } from '@node-rs/argon2';
import type { Repository } from 'typeorm';
import type { UserEntity } from '../../db/entities/user.entity.js';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUser,
  type UpdateUser,
} from './user.schema.js';
import { BaseService } from '../../common/base.service.js';

const passwordHash = (password: string) =>
  hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

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
    const password = await passwordHash(data.password);

    return await this.repository.save(
      this.repository.create({ name: data.name, email: data.email, password }),
    );
  }

  async update(id: string, input: UpdateUser) {
    const data = updateUserSchema.parse(input);
    const partial: Partial<UserEntity> = {};

    if (data.name !== undefined) partial.name = data.name;
    if (data.email !== undefined) partial.email = data.email;
    if (data.password !== undefined)
      partial.password = await passwordHash(data.password);

    const result = await this.repository.update(id, partial);
    if (!result.affected) return await this.get(id);

    return this.get(id);
  }
}
