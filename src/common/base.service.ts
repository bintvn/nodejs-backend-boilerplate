import {
  EntityManager,
  IsNull,
  Not,
  type DeepPartial,
  type FindManyOptions,
  type FindOptionsWhere,
  type ObjectLiteral,
  type QueryDeepPartialEntity,
  type Repository,
} from 'typeorm';
import { NotFoundError } from './errors.js';

export interface IBaseEntity extends ObjectLiteral {
  id: string;
  deletedAt: Date | null;
}

export abstract class BaseService<
  TEntity extends IBaseEntity,
  TRepository extends Repository<TEntity> = Repository<TEntity>,
> {
  abstract readonly name: string;
  repository: TRepository;

  constructor(protected readonly sourceRepository: TRepository) {
    this.repository = sourceRepository;
  }

  async getAll(options?: FindManyOptions<TEntity>, manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(this.repository.target)
      : this.repository;

    return repository.find(options);
  }

  async get(id: TEntity['id'], manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(this.repository.target)
      : this.repository;

    return await repository.findOne({
      where: { id } as FindOptionsWhere<TEntity>,
    });
  }

  async getBy(where: FindOptionsWhere<TEntity>, manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(this.repository.target)
      : this.repository;

    return await repository.findOne({
      where,
    });
  }

  async create(data: DeepPartial<TEntity>, manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(this.repository.target)
      : this.repository;

    const entity = repository.create(data);

    return await repository.save(entity);
  }

  async update(
    id: TEntity['id'],
    newData: QueryDeepPartialEntity<TEntity>,
    manager?: EntityManager,
  ) {
    const repository = manager
      ? manager.getRepository(this.repository.target)
      : this.repository;

    if (Object.keys(newData).length > 0) {
      await repository.update(id, newData);

      return true;
    }

    return false;
  }

  async delete(id: TEntity['id'], manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(this.repository.target)
      : this.repository;

    const result = await repository.delete(id);

    if (result.affected === 0)
      throw new NotFoundError(`${this.name} with ID ${id} not found`);

    return true;
  }

  async softDelete(
    id: TEntity['id'],
    manager?: EntityManager,
  ): Promise<boolean> {
    const repository = manager
      ? manager.getRepository(this.repository.target)
      : this.repository;

    const result = await repository.softDelete({
      id,
      deletedAt: IsNull(),
    } as FindOptionsWhere<TEntity>);

    if (!result.affected) {
      throw new NotFoundError(`${this.name} with ID ${id} not found`);
    }

    return true;
  }

  async restore(id: TEntity['id'], manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(this.repository.target)
      : this.repository;

    return await repository.update(
      {
        id,
        deletedAt: Not(IsNull()),
      } as FindOptionsWhere<TEntity>,
      {
        deletedAt: null,
      } as unknown as QueryDeepPartialEntity<TEntity>,
    );
  }
}
