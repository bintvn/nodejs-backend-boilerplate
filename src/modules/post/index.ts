import type { DataSource } from 'typeorm';
import { PostEntity } from './post.entity.js';
import PostService from './post.service.js';
import PostController from './post.controller.js';
import type { Router } from 'express';
import createPostRouter from './post.routes.js';
import type { AuthService } from '../../core/modules/auth/auth.service.js';

export interface PostModule {
  PostEntity: typeof PostEntity;
  service: PostService;
  controller: PostController;
  router: Router;
}

export const createPostModule = (
  dataSource: DataSource,
  authService: AuthService,
): PostModule => {
  const service = new PostService(dataSource.getRepository(PostEntity));
  const controller = new PostController(service);
  const router = createPostRouter(controller, authService);

  return {
    PostEntity: PostEntity,
    service,
    controller,
    router,
  };
};
