import type { Router } from 'express';
import ModuleController from './module.controller.js';
import ModuleService from './module.service.js';
import { ModuleEntity } from './module.entity.js';
import createModuleRouter from './module.route.js';
import type { DataSource } from 'typeorm';

export interface ModuleModule {
  ModuleEntity: typeof ModuleEntity;
  service: ModuleService;
  controller: ModuleController;
  router: Router;
}

const createModuleModule = (dataSource: DataSource): ModuleModule => {
  const service = new ModuleService(dataSource.getRepository(ModuleEntity));
  const controller = new ModuleController(service);
  const router = createModuleRouter(controller);

  return {
    ModuleEntity,
    service,
    controller,
    router,
  };
};

export default createModuleModule;
