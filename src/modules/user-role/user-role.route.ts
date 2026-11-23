import { Router } from 'express';
import { userRoleController } from '../../bootstrap.js';

const userRoleRoutes = Router();

userRoleRoutes.get('/', userRoleController.getAll);
userRoleRoutes.get('/:id', userRoleController.get);
userRoleRoutes.post('/', userRoleController.create);
userRoleRoutes.patch('/:id', userRoleController.update);
userRoleRoutes.delete('/:id', userRoleController.delete);

export default userRoleRoutes;
