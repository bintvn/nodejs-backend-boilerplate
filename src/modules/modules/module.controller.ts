import type { Request, Response } from 'express';
import { parseBody, parsePatchId } from '../../common/validation.js';
import type ModuleService from './module.service.js';
import type { ModuleEntity } from '../../db/entities/module.entity.js';
import { createModuleSchema, updateModuleSchema } from './module.schema.js';

export const moduleDto = (module: ModuleEntity) => ({
  id: module.id,
  createdAt: module.createdAt,
  updatedAt: module.updatedAt,
  disabled: module.disabled,
  name: module.name,
  slug: module.slug,
  description: module.description,
});

export default class ModuleController {
  readonly name = 'module';

  constructor(private readonly service: ModuleService) {}

  getAll = async (_request: Request, response: Response) => {
    response.json({ data: (await this.service.getAll()).map(moduleDto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    response.json({
      data: moduleDto(await this.service.get(request.params.id)),
    });
  };

  create = async (request: Request, response: Response) => {
    const data = parseBody(createModuleSchema, request.body);

    response
      .status(201)
      .json({ data: moduleDto(await this.service.create(data)) });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const id = parsePatchId(request.params.id);
    const data = parseBody(updateModuleSchema, request.body);

    response.json({
      data: moduleDto(await this.service.update(id, data)),
    });
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
