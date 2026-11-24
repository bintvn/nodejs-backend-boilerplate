import { Router } from 'express';
import type AccessControlController from './access-control.controller.js';

const createAccessControlRouter = (
  accessControlController: AccessControlController,
) => {
  const accessControlRoutes = Router();

  accessControlRoutes.get('/', accessControlController.getAll);
  accessControlRoutes.get('/:id', accessControlController.get);
  accessControlRoutes.post('/', accessControlController.create);
  accessControlRoutes.patch('/:id', accessControlController.update);
  accessControlRoutes.delete('/:id', accessControlController.delete);

  return accessControlRoutes;
};

export default createAccessControlRouter;
