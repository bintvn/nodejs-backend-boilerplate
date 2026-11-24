import type { Router } from 'express';
import RoleController from './role.controller.js';
import RoleService from './role.service.js';
import createRoleRouter from './role.route.js';
import { RoleEntity } from './role.entity.js';
import type { DataSource } from 'typeorm';

export interface RoleModule {
  RoleEntity: typeof RoleEntity;
  service: RoleService;
  controller: RoleController;
  router: Router;
}

const createRoleModule = (dataSource: DataSource): RoleModule => {
  const service = new RoleService(dataSource.getRepository(RoleEntity));
  const controller = new RoleController(service);
  const router = createRoleRouter(controller);

  return {
    RoleEntity,
    service,
    controller,
    router,
  };
};

export default createRoleModule;
