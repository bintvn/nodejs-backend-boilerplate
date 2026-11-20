import type { Request, Response } from 'express';
import { parseBody, parsePatchId } from '../../common/validation.js';
import type { UserEntity } from '../../db/entities/user.entity.js';
import { createUserSchema, updateUserSchema } from './user.schema.js';
import type UserService from './user.service.js';

export const userDto = (user: UserEntity) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  disabled: user.disabled,
});

export default class UserController {
  readonly name = 'user';

  constructor(private readonly service: UserService) {}

  getAll = async (_request: Request, response: Response) => {
    response.json({ data: (await this.service.getAll()).map(userDto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    response.json({ data: userDto(await this.service.get(request.params.id)) });
  };

  create = async (request: Request, response: Response) => {
    const data = parseBody(createUserSchema, request.body);
    response
      .status(201)
      .json({ data: userDto(await this.service.create(data)) });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const id = parsePatchId(request.params.id);
    const data = parseBody(updateUserSchema, request.body);
    response.json({
      data: userDto(await this.service.update(id, data)),
    });
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);
    response.status(204).send();
  };
}
