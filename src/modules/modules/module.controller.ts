import type { Request, Response } from 'express';
import type ModuleService from './module.service.js';
import type { ModuleEntity } from '../../db/entities/module.entity.js';
import { ValidationError } from '../../common/errors.js';
import { createModuleSchema, updateModuleSchema } from './module.schema.js';

const dto = (module: ModuleEntity) => ({
  id: module.id,
  createdAt: module.createdAt,
  updatedAt: module.updatedAt,
  disabled: module.disabled,
  name: module.name,
});

export default class ModuleController {
  readonly name = 'module';

  constructor(private readonly service: ModuleService) {}

  getAll = async (_request: Request, response: Response) => {
    response.json({ data: (await this.service.getAll()).map(dto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    response.json({ data: dto(await this.service.get(request.params.id)) });
  };

  create = async (request: Request, response: Response) => {
    const parsed = createModuleSchema.safeParse(request.body);

    if (!parsed.success)
      throw new ValidationError('Validation failed', parsed.error);

    response
      .status(201)
      .json({ data: dto(await this.service.create(parsed.data)) });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const parsed = updateModuleSchema.safeParse(request.body);

    if (!parsed.success)
      throw new ValidationError('Validation failed', parsed.error);

    response.json({
      data: dto(await this.service.update(request.params.id, parsed.data)),
    });
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
