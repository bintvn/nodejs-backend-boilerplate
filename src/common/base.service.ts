import type {
  DeepPartial,
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
  QueryDeepPartialEntity,
  Repository,
} from 'typeorm';
import { NotFoundError } from './errors.js';

export interface IBaseEntity extends ObjectLiteral {
  id: string;
}

export abstract class BaseService<
  TEntity extends IBaseEntity,
  TRepository extends Repository<TEntity> = Repository<TEntity>,
> {
  abstract readonly name: string;

  constructor(
    protected readonly repository: TRepository,
    private readonly relations?: FindOptionsRelations<TEntity>,
  ) {}

  getAll(options?: FindManyOptions<TEntity>) {
    return this.repository.find({ relations: this.relations, ...options });
  }

  async get(id: TEntity['id']): Promise<TEntity> {
    const data = await this.repository.findOne({
      where: { id } as FindOptionsWhere<TEntity>,
      relations: this.relations,
    });

    if (!data) {
      throw new NotFoundError(`${this.name} with ID ${id} not found`);
    }

    return data;
  }

  async create(data: DeepPartial<TEntity>) {
    const entity = this.repository.create(data);

    const saved = await this.repository.save(entity);
    return this.relations ? this.get(saved.id) : saved;
  }

  async update(id: TEntity['id'], newData: QueryDeepPartialEntity<TEntity>) {
    if (Object.keys(newData).length > 0) {
      await this.repository.update(id, newData);
    }
    return this.get(id);
  }

  async delete(id: TEntity['id']) {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundError(`${this.name} with ID ${id} not found`);
    }

    return true;
  }
}
