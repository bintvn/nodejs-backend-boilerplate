import { Router } from 'express';
import { roleController } from '../../../bootstrap.js';

const roleRoutes = Router();

roleRoutes.get('/', roleController.getAll);
roleRoutes.get('/:id', roleController.get);
roleRoutes.post('/', roleController.create);
roleRoutes.patch('/:id', roleController.update);
roleRoutes.delete('/:id', roleController.delete);

export default roleRoutes;
