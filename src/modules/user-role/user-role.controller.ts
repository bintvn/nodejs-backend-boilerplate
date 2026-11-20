import type { Request, Response } from 'express';
import type { UserRoleEntity } from '../../db/entities/user-role.entity.js';
import {
  createUserRoleSchema,
  updateUserRoleSchema,
} from './user-role.schema.js';
import type UserRoleService from './user-role.service.js';
import { ValidationError } from '../../common/errors.js';

const dto = (userRole: UserRoleEntity) => ({
  id: userRole.id,
  createdAt: userRole.createdAt,
  updatedAt: userRole.updatedAt,
  disabled: userRole.disabled,
  user: userRole.user,
  role: userRole.role,
});

export default class UserRoleController {
  readonly name = 'user-role';

  constructor(private readonly service: UserRoleService) {}

  getAll = async (_request: Request, response: Response) => {
    response.json({ data: (await this.service.getAll()).map(dto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    response.json({ data: dto(await this.service.get(request.params.id)) });
  };

  create = async (request: Request, response: Response) => {
    const parsed = createUserRoleSchema.safeParse(request.body);

    if (!parsed.success)
      throw new ValidationError('Validation failed', parsed.error);

    response.status(201).json({
      data: dto(
        await this.service.create({
          user: { id: parsed.data.userId },
          role: { id: parsed.data.roleId },
        }),
      ),
    });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const parsed = updateUserRoleSchema.safeParse(request.body);

    if (!parsed.success)
      throw new ValidationError('Validation failed', parsed.error);

    response.json({
      data: dto(
        await this.service.update(request.params.id, {
          user: { id: parsed.data.userId },
          role: { id: parsed.data.roleId },
        }),
      ),
    });
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
