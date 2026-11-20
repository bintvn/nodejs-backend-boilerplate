import type { Request, Response } from 'express';
import type { UserEntity } from '../../db/entities/user.entity.js';
import { createUserSchema, updateUserSchema } from './user.schema.js';
import type UserService from './user.service.js';

const dto = (user: UserEntity) => ({
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
    response.json({ data: (await this.service.getAll()).map(dto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    response.json({ data: dto(await this.service.get(request.params.id)) });
  };

  create = async (request: Request, response: Response) => {
    const parsed = createUserSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: { message: 'Bad Request' } });
      return;
    }
    response
      .status(201)
      .json({ data: dto(await this.service.create(parsed.data)) });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const parsed = updateUserSchema.safeParse(request.body);
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
