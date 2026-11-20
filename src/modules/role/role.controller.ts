import type { Request, Response } from 'express';
import type { RoleEntity } from '../../db/entities/role.entity.js';
import type RoleService from './role.service.js';
import { createRoleSchema, updateRoleSchema } from './role.schema.js';

const dto = (role: RoleEntity) => ({
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
    response.json({ data: (await this.service.getAll()).map(dto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    response.json({ data: dto(await this.service.get(request.params.id)) });
  };

  create = async (request: Request, response: Response) => {
    const parsed = createRoleSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: { message: 'Bad Request' } });
      return;
    }
    response
      .status(201)
      .json({ data: dto(await this.service.create(parsed.data)) });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const parsed = updateRoleSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: { message: 'Bad Request' } });
      return;
    }
    response.json({
      data: dto(await this.service.update(request.params.id, parsed.data)),
    });
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
