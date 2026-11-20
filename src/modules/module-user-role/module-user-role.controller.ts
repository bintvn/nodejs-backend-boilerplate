import type { Request, Response } from 'express';
import type { ModuleUserRoleEntity } from '../../db/entities/module-user-role.entity.js';
import type ModuleRoleService from './module-user-role.service.js';
import {
  createModuleUserRoleSchema,
  updateModuleUserRoleSchema,
} from './module-user-role.schema.js';
import { ValidationError } from '../../common/errors.js';

const dto = (moduleRole: ModuleUserRoleEntity) => ({
  id: moduleRole.id,
  createdAt: moduleRole.createdAt,
  updatedAt: moduleRole.updatedAt,
  disabled: moduleRole.disabled,
  module: moduleRole.module,
  userRole: moduleRole.userRole,
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
    const parsed = createModuleUserRoleSchema.safeParse(request.body);

    if (!parsed.success)
      throw new ValidationError('Validation failed', parsed.error);

    response.status(201).json({
      data: dto(
        await this.service.create({
          module: { id: parsed.data.moduleId },
          userRole: { id: parsed.data.userRoleId },
        }),
      ),
    });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const parsed = updateModuleUserRoleSchema.safeParse(request.body);

    if (!parsed.success)
      throw new ValidationError('Validation failed', parsed.error);

    response.json({
      data: dto(
        await this.service.update(request.params.id, {
          module: { id: parsed.data.moduleId },
          userRole: { id: parsed.data.userRoleId },
        }),
      ),
    });
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
