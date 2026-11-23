import { Router } from 'express';
import { moduleController } from '../../bootstrap.js';

const moduleRoutes = Router();

moduleRoutes.get('/', moduleController.getAll);
moduleRoutes.get('/:id', moduleController.get);
moduleRoutes.post('/', moduleController.create);
moduleRoutes.patch('/:id', moduleController.update);
moduleRoutes.delete('/:id', moduleController.delete);

export default moduleRoutes;
