import { Router } from 'express';
import indexRoutes from './index.route.js';
import userRoutes from './user.route.js';
import userRoleRoutes from './user-role.route.js';
import notFoundRoute from './not-found.route.js';
import moduleRoutes from './module.route.js';
import moduleUserRoleRoutes from './module-user-role.route.js';
import roleRoutes from './role.route.js';

const router = Router();

router.use('/', indexRoutes);
router.use('/modules', moduleRoutes);
router.use('/module-user-roles', moduleUserRoleRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/user-roles', userRoleRoutes);
router.use(notFoundRoute);

export default router;
