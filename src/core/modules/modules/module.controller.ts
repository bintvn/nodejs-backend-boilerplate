import type { Request, Response } from 'express';
import { parseBody, parsePatchId } from '../../validation.js';
import type ModuleService from './module.service.js';
import { createModuleSchema, updateModuleSchema } from './module.schema.js';
import { moduleDto } from './module.dto.js';

export default class ModuleController {
  readonly name = 'module';

  constructor(private readonly service: ModuleService) {}

  getAll = async (_request: Request, response: Response) => {
    response.json({ data: (await this.service.getAll()).map(moduleDto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    const module = await this.service.get(request.params.id);

    if (!module)
      throw new Error(`${this.name} with ID ${request.params.id} not found`);

    response.json({
      data: moduleDto(module),
    });
  };

  create = async (request: Request, response: Response) => {
    const data = parseBody(createModuleSchema, request.body);
    const module = await this.service.create(data);

    response.status(201).json({ data: moduleDto(module) });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const id = parsePatchId(request.params.id);
    const data = parseBody(updateModuleSchema, request.body);
    await this.service.update(id, data);

    response.status(204).send();
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
