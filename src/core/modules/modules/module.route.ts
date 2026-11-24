import { Router } from 'express';
import type ModuleController from './module.controller.js';

const createModuleRouter = (moduleController: ModuleController) => {
  const moduleRoutes = Router();

  moduleRoutes.get('/', moduleController.getAll);
  moduleRoutes.get('/:id', moduleController.get);
  moduleRoutes.post('/', moduleController.create);
  moduleRoutes.patch('/:id', moduleController.update);
  moduleRoutes.delete('/:id', moduleController.delete);

  return moduleRoutes;
};

export default createModuleRouter;
