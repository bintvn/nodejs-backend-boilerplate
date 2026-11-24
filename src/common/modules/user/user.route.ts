import { Router } from 'express';
import { userController } from '../../../bootstrap.js';

const userRoutes = Router();

userRoutes.get('/', userController.getAll);
userRoutes.get('/:id', userController.get);
userRoutes.post('/', userController.create);
userRoutes.patch('/:id', userController.update);
userRoutes.delete('/:id', userController.delete);

export default userRoutes;
