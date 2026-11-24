import { Router } from 'express';
import indexRoutes from './index.route.js';
import userRoutes from '../common/modules/user/user.route.js';
import userRoleRoutes from '../common/modules/user-role/user-role.route.js';
import notFoundRoute from './not-found.route.js';
import moduleRoutes from '../common/modules/modules/module.route.js';
import moduleUserRoleRoutes from '../common/modules/module-user-role/module-user-role.route.js';
import roleRoutes from '../common/modules/role/role.route.js';
import { createAuthRouter } from '../common/modules/auth/auth.routes.js';

const router = Router();

router.use('/', indexRoutes);
router.use('/auth', createAuthRouter());
router.use('/modules', moduleRoutes);
router.use('/module-user-roles', moduleUserRoleRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/user-roles', userRoleRoutes);
router.use(notFoundRoute);

export default router;
