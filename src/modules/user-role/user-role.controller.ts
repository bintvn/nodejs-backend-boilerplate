import type { Request, Response } from 'express';
import { parseBody, parsePatchId } from '../../common/validation.js';
import type { UserRoleEntity } from '../../db/entities/user-role.entity.js';
import {
  createUserRoleSchema,
  updateUserRoleSchema,
} from './user-role.schema.js';
import type UserRoleService from './user-role.service.js';
import { roleDto } from '../role/role.controller.js';
import { userDto } from '../user/user.controller.js';

export const userRoleDto = (userRole: UserRoleEntity) => ({
  id: userRole.id,
  createdAt: userRole.createdAt,
  updatedAt: userRole.updatedAt,
  disabled: userRole.disabled,
  user: userDto(userRole.user),
  role: roleDto(userRole.role),
});

export default class UserRoleController {
  readonly name = 'user-role';

  constructor(private readonly service: UserRoleService) {}

  getAll = async (_request: Request, response: Response) => {
    response.json({ data: (await this.service.getAll()).map(userRoleDto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    response.json({
      data: userRoleDto(await this.service.get(request.params.id)),
    });
  };

  create = async (request: Request, response: Response) => {
    const data = parseBody(createUserRoleSchema, request.body);

    response.status(201).json({
      data: userRoleDto(
        await this.service.create({
          user: { id: data.userId },
          role: { id: data.roleId },
        }),
      ),
    });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const id = parsePatchId(request.params.id);
    const data = parseBody(updateUserRoleSchema, request.body);

    response.json({
      data: userRoleDto(
        await this.service.update(id, {
          ...(data.userId && { user: { id: data.userId } }),
          ...(data.roleId && { role: { id: data.roleId } }),
        }),
      ),
    });
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
