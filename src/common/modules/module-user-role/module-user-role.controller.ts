import type { Request, Response } from 'express';
import { parseBody, parsePatchId } from '../../validation.js';
import type ModuleRoleService from './module-user-role.service.js';
import {
  createModuleUserRoleSchema,
  updateModuleUserRoleSchema,
} from './module-user-role.schema.js';
import moduleUserRoleDto from './module-user-role.dto.js';

export default class ModuleRoleController {
  readonly name = 'module';

  constructor(private readonly service: ModuleRoleService) {}

  getAll = async (_request: Request, response: Response) => {
    response.json({
      data: (await this.service.getAll()).map(moduleUserRoleDto),
    });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    const moduleUserRole = await this.service.get(request.params.id);

    if (!moduleUserRole)
      throw new Error(`${this.name} with ID ${request.params.id} not found`);

    response.json({ data: moduleUserRoleDto(moduleUserRole) });
  };

  create = async (request: Request, response: Response) => {
    const data = parseBody(createModuleUserRoleSchema, request.body);
    const moduleUserRole = await this.service.create({
      module: { id: data.moduleId },
      userRole: { id: data.userRoleId },
    });

    response.status(201).json({
      data: moduleUserRoleDto(moduleUserRole),
    });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const id = parsePatchId(request.params.id);
    const data = parseBody(updateModuleUserRoleSchema, request.body);
    await this.service.update(id, {
      ...(data.moduleId && { module: { id: data.moduleId } }),
      ...(data.userRoleId && {
        userRole: { id: data.userRoleId },
      }),
    });

    response.status(204).send();
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
