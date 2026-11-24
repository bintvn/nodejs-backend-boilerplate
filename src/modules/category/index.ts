import type { DataSource } from 'typeorm';
import { CategoryPostEntity } from './category-post.entity.js';
import { CategoryEntity } from './category.entity.js';
import CategoryService from './category.service.js';

export interface CategoryModule {
  CategoryEntity: typeof CategoryEntity;
  CategoryPostEntity: typeof CategoryPostEntity;
  service: CategoryService;
}

const createCategoryModule = (dataSource: DataSource): CategoryModule => {
  const service = new CategoryService(
    dataSource.getRepository(CategoryEntity),
    dataSource.getRepository(CategoryPostEntity),
  );

  return {
    CategoryEntity: CategoryEntity,
    CategoryPostEntity: CategoryPostEntity,
    service,
  };
};

export default createCategoryModule;
