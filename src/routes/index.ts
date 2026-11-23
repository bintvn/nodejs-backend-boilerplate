import { Router } from 'express';
import indexRoutes from './index.route.js';
import userRoutes from '../modules/user/user.route.js';
import userRoleRoutes from '../modules/user-role/user-role.route.js';
import notFoundRoute from './not-found.route.js';
import moduleRoutes from '../modules/modules/module.route.js';
import moduleUserRoleRoutes from '../modules/module-user-role/module-user-role.route.js';
import roleRoutes from '../modules/role/role.route.js';

const router = Router();

router.use('/', indexRoutes);
router.use('/modules', moduleRoutes);
router.use('/module-user-roles', moduleUserRoleRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/user-roles', userRoleRoutes);
router.use(notFoundRoute);

export default router;
