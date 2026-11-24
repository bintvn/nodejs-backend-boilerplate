import { Router } from 'express';
import type UserController from './user.controller.js';

const createUserRouter = (userController: UserController) => {
  const userRoutes = Router();

  userRoutes.get('/', userController.getAll);
  userRoutes.get('/:id', userController.get);
  userRoutes.post('/', userController.create);
  userRoutes.patch('/:id', userController.update);
  userRoutes.delete('/:id', userController.delete);

  return userRoutes;
};

export default createUserRouter;
