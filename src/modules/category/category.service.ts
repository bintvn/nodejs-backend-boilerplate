import type { Repository } from 'typeorm';
import { BaseService } from '../../core/base.service.js';
import type { CategoryEntity } from './category.entity.js';
import type { CategoryPostEntity } from './category-post.entity.js';

export default class CategoryService extends BaseService<
  CategoryEntity,
  Repository<CategoryEntity>
> {
  name = 'post';

  constructor(
    readonly repository: Repository<CategoryEntity>,
    readonly categoryPostRepository: Repository<CategoryPostEntity>,
  ) {
    super(repository);
  }
}
