import type { Request, Response } from 'express';
import { parseBody, parsePatchId } from '../../validation.js';
import {
  createUserRoleSchema,
  updateUserRoleSchema,
} from './user-role.schema.js';
import type UserRoleService from './user-role.service.js';
import { userRoleDto } from './user-role.dto.js';

export default class UserRoleController {
  readonly name = 'user-role';

  constructor(private readonly service: UserRoleService) {}

  getAll = async (_request: Request, response: Response) => {
    response.json({ data: (await this.service.getAll()).map(userRoleDto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    const userRole = await this.service.get(request.params.id);

    if (!userRole)
      throw new Error(`${this.name} with ID ${request.params.id} not found`);

    response.json({
      data: userRoleDto(userRole),
    });
  };

  create = async (request: Request, response: Response) => {
    const data = parseBody(createUserRoleSchema, request.body);
    const userRole = await this.service.create({
      user: { id: data.userId },
      role: { id: data.roleId },
    });

    response.status(201).json({
      data: userRoleDto(userRole),
    });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const id = parsePatchId(request.params.id);
    const data = parseBody(updateUserRoleSchema, request.body);
    await this.service.update(id, {
      ...(data.userId && { user: { id: data.userId } }),
      ...(data.roleId && { role: { id: data.roleId } }),
    });

    response.status(204).send();
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
