import { Router } from 'express';
import type PostController from './post.controller.js';
import { createAuthMiddleware } from '../../core/middlewares/auth.middleware.js';
import type { AuthService } from '../../core/modules/auth/auth.service.js';

const createPostRouter = (
  postController: PostController,
  authService: AuthService,
) => {
  const postRoutes = Router();
  const authenticate = createAuthMiddleware(authService);

  postRoutes.get('/', authenticate, postController.getAll);
  postRoutes.get('/:id', authenticate, postController.get);
  postRoutes.post('/', authenticate, postController.create);
  postRoutes.patch('/:id', authenticate, postController.update);
  postRoutes.delete('/:id', authenticate, postController.delete);

  return postRoutes;
};

export default createPostRouter;
