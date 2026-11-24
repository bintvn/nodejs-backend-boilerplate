import type { Router } from 'express';
import UserController from './user.controller.js';
import UserService from './user.service.js';
import { UserEntity } from './user.entity.js';
import type RoleService from '../role/role.service.js';
import type { DataSource } from 'typeorm';
import createUserRouter from './user.route.js';

export interface UserModule {
  UserEntity: typeof UserEntity;
  service: UserService;
  controller: UserController;
  router: Router;
}

export interface UserServiceDependencies {
  roleService: RoleService;
}

const createUserModule = (
  dataSource: DataSource,
  dependencies: UserServiceDependencies,
): UserModule => {
  const service = new UserService(
    dataSource.getRepository(UserEntity),
    dependencies,
  );
  const controller = new UserController(service);
  const router = createUserRouter(controller);

  return {
    UserEntity: UserEntity,
    service,
    controller,
    router,
  };
};

export default createUserModule;
