import type { Request, Response } from 'express';
import { parseBody, parsePatchId } from '../../common/validation.js';
import type { ModuleUserRoleEntity } from '../../db/entities/module-user-role.entity.js';
import type ModuleRoleService from './module-user-role.service.js';
import {
  createModuleUserRoleSchema,
  updateModuleUserRoleSchema,
} from './module-user-role.schema.js';
import { moduleDto } from '../modules/module.controller.js';
import { userRoleDto } from '../user-role/user-role.controller.js';

const dto = (moduleRole: ModuleUserRoleEntity) => ({
  id: moduleRole.id,
  createdAt: moduleRole.createdAt,
  updatedAt: moduleRole.updatedAt,
  disabled: moduleRole.disabled,
  module: moduleDto(moduleRole.module),
  userRole: userRoleDto(moduleRole.userRole),
});

export default class ModuleRoleController {
  readonly name = 'module';

  constructor(private readonly service: ModuleRoleService) {}

  getAll = async (_request: Request, response: Response) => {
    response.json({ data: (await this.service.getAll()).map(dto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    response.json({ data: dto(await this.service.get(request.params.id)) });
  };

  create = async (request: Request, response: Response) => {
    const data = parseBody(createModuleUserRoleSchema, request.body);

    response.status(201).json({
      data: dto(
        await this.service.create({
          module: { id: data.moduleId },
          userRole: { id: data.userRoleId },
        }),
      ),
    });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const id = parsePatchId(request.params.id);
    const data = parseBody(updateModuleUserRoleSchema, request.body);

    response.json({
      data: dto(
        await this.service.update(id, {
          ...(data.moduleId && { module: { id: data.moduleId } }),
          ...(data.userRoleId && {
            userRole: { id: data.userRoleId },
          }),
        }),
      ),
    });
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
