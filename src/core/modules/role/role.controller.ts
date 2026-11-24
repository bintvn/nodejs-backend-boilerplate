import type { Request, Response } from 'express';
import type RoleService from './role.service.js';
import { createRoleSchema, updateRoleSchema } from './role.schema.js';
import { roleDto } from './role.dto.js';
import { parseBody, parsePatchId } from '../../validation.js';

export default class RoleController {
  readonly name = 'role';

  constructor(private readonly service: RoleService) {}

  getAll = async (_request: Request, response: Response) => {
    const roles = await this.service.getAll();

    response.json({ data: roles.map(roleDto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    const role = await this.service.get(request.params.id);

    if (!role)
      throw new Error(`${this.name} with ID ${request.params.id} not found`);

    response.json({ data: roleDto(role) });
  };

  create = async (request: Request, response: Response) => {
    const data = parseBody(createRoleSchema, request.body);
    const role = await this.service.create(data);

    response.status(201).json({ data: roleDto(role) });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const id = parsePatchId(request.params.id);
    const data = parseBody(updateRoleSchema, request.body);
    await this.service.update(id, data);

    response.status(204).send();
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);

    response.status(204).send();
  };
}
