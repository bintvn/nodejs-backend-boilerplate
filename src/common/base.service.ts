import type {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { NotFoundError } from './errors.js';

export interface IBaseEntity extends ObjectLiteral {
  id: string;
}

export type BaseServiceMap = Record<string, BaseService<IBaseEntity>>;

export abstract class BaseService<
  TEntity extends IBaseEntity,
  TRepository extends Repository<TEntity> = Repository<TEntity>,
  TServices extends BaseServiceMap = BaseServiceMap,
> {
  abstract readonly name: string;

  constructor(
    protected readonly repository: TRepository,
    protected readonly services?: TServices,
  ) {}

  getAll(options?: FindManyOptions<TEntity>) {
    return this.repository.find(options);
  }

  async get(id: TEntity['id']): Promise<TEntity> {
    const data = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<TEntity>);

    if (!data) {
      throw new NotFoundError(`${this.name} with ID ${id} not found`);
    }

    return data;
  }

  create(data: DeepPartial<TEntity>) {
    const entity = this.repository.create(data);

    return this.repository.save(entity);
  }

  async update(id: TEntity['id'], newData: DeepPartial<TEntity>) {
    const oldData = await this.get(id);
    const merged = this.repository.merge(oldData, newData);

    return await this.repository.save(merged);
  }

  async delete(id: TEntity['id']) {
    const data = await this.get(id);
    await this.repository.delete(data.id);

    return true;
  }
}
