import { Router } from 'express';
import { moduleUserRoleController } from '../bootstrap.js';

const moduleUserRoleRoutes = Router();

moduleUserRoleRoutes.get('/', moduleUserRoleController.getAll);
moduleUserRoleRoutes.get('/:id', moduleUserRoleController.get);
moduleUserRoleRoutes.post('/', moduleUserRoleController.create);
moduleUserRoleRoutes.patch('/:id', moduleUserRoleController.update);
moduleUserRoleRoutes.delete('/:id', moduleUserRoleController.delete);

export default moduleUserRoleRoutes;
