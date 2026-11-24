import { Router } from 'express';
import indexRoutes from './routes/index.route.js';
import { type Container } from './bootstrap.js';
import notFoundRoute from './routes/not-found.route.js';

const createRouter = (container: Container) => {
  const router = Router();

  router.use('/', indexRoutes);
  router.use('/auth', container.authModule.router);
  router.use('/access-controls', container.accessControlModule.router);
  router.use('/modules', container.moduleModule.router);
  router.use('/roles', container.roleModule.router);
  router.use('/users', container.userModule.router);
  router.use('/user-roles', container.userRoleModule.router);
  router.use(notFoundRoute);

  return router;
};

export default createRouter;
