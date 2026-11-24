import { Router } from 'express';
import type RoleController from './role.controller.js';

const createRoleRouter = (roleController: RoleController) => {
  const roleRoutes = Router();

  roleRoutes.get('/', roleController.getAll);
  roleRoutes.get('/:id', roleController.get);
  roleRoutes.post('/', roleController.create);
  roleRoutes.patch('/:id', roleController.update);
  roleRoutes.delete('/:id', roleController.delete);

  return roleRoutes;
};

export default createRoleRouter;
