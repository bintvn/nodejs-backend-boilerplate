import { Router } from 'express';
import type UserRoleController from './user-role.controller.js';

const createUserRoleRouter = (userRoleController: UserRoleController) => {
  const userRoleRoutes = Router();

  userRoleRoutes.get('/', userRoleController.getAll);
  userRoleRoutes.get('/:id', userRoleController.get);
  userRoleRoutes.post('/', userRoleController.create);
  userRoleRoutes.patch('/:id', userRoleController.update);
  userRoleRoutes.delete('/:id', userRoleController.delete);

  return userRoleRoutes;
};

export default createUserRoleRouter;
