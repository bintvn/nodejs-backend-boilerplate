import type { Request, Response } from 'express';
import { parseBody, parsePatchId } from '../../common/validation.js';
import type { RoleEntity } from '../../db/entities/role.entity.js';
import type RoleService from './role.service.js';
import { createRoleSchema, updateRoleSchema } from './role.schema.js';

export const roleDto = (role: RoleEntity) => ({
  id: role.id,
  createdAt: role.createdAt,
  updatedAt: role.updatedAt,
  disabled: role.disabled,
  name: role.name,
  slug: role.slug,
  description: role.description,
});

export default class RoleController {
  readonly name = 'user-role';

  constructor(private readonly service: RoleService) {}

  getAll = async (_request: Request, response: Response) => {
    response.json({ data: (await this.service.getAll()).map(roleDto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    response.json({ data: roleDto(await this.service.get(request.params.id)) });
  };

  create = async (request: Request, response: Response) => {
    const data = parseBody(createRoleSchema, request.body);
    response
      .status(201)
      .json({ data: roleDto(await this.service.create(data)) });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const id = parsePatchId(request.params.id);
    const data = parseBody(updateRoleSchema, request.body);
    response.json({
      data: roleDto(await this.service.update(id, data)),
    });
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
