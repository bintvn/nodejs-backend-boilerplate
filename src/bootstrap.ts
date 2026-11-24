import { DataSource } from 'typeorm';
import { createPostModule } from './modules/post/index.js';
import createCategoryModule from './modules/category/index.js';
import type { AuthService } from './core/modules/auth/auth.service.js';

export type AppContainer = ReturnType<typeof createAppContainer>;

const createAppContainer = (
  dataSource: DataSource,
  authService: AuthService,
) => {
  const postModule = createPostModule(dataSource, authService);
  const categoryModule = createCategoryModule(dataSource);

  return {
    postModule,
    categoryModule,
  };
};

export default createAppContainer;
