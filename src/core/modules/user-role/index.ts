import type { DataSource } from 'typeorm';
import { UserRoleEntity } from './user-role.entity.js';
import UserRoleService from './user-role.service.js';
import UserRoleController from './user-role.controller.js';
import createUserRoleRouter from './user-role.route.js';
import type { Router } from 'express';

export interface UserRoleModule {
  UserRoleEntity: typeof UserRoleEntity;
  service: UserRoleService;
  controller: UserRoleController;
  router: Router;
}

const createUserRoleModule = (dataSource: DataSource): UserRoleModule => {
  const service = new UserRoleService(dataSource.getRepository(UserRoleEntity));
  const controller = new UserRoleController(service);
  const router = createUserRoleRouter(controller);

  return {
    UserRoleEntity,
    service,
    controller,
    router,
  };
};

export default createUserRoleModule;
