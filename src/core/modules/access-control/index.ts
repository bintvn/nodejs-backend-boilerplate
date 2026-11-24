import type { Router } from 'express';
import AccessControlController from './access-control.controller.js';
import { AccessControlEntity } from './access-control.entity.js';
import createAccessControlRouter from './access-control.route.js';
import AccessControlService from './access-control.service.js';
import accessControlDto from './access-control.dto.js';
import type { DataSource } from 'typeorm';

export interface AccessControlModule {
  AccessControlEntity: typeof AccessControlEntity;
  service: AccessControlService;
  controller: AccessControlController;
  router: Router;
  dto: typeof accessControlDto;
}

const createAccessControlModule = (dataSource: DataSource) => {
  const service = new AccessControlService(
    dataSource.getRepository(AccessControlEntity),
  );
  const controller = new AccessControlController(service);
  const router = createAccessControlRouter(controller);

  return {
    AccessControlEntity,
    service,
    controller,
    router,
  };
};

export default createAccessControlModule;
