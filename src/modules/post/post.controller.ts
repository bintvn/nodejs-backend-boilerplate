import type { Request, Response } from 'express';
import { parseBody, parsePatchId } from '../../core/validation.js';
import { createPostSchema, updatePostSchema } from './post.schema.js';
import type PostService from './post.service.js';
import { NotFoundError } from '../../core/errors.js';
import postDto from './post.dto.js';

export default class PostController {
  readonly name = 'post';

  constructor(private readonly service: PostService) {}

  getAll = async (_request: Request, response: Response) => {
    const posts = await this.service.getAll();

    response.json({ data: posts.map(postDto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    const post = await this.service.get(request.params.id);

    if (!post)
      throw new NotFoundError(
        `${this.name} with ID ${request.params.id} not found`,
      );

    response.json({ data: postDto(post) });
  };

  create = async (request: Request, response: Response) => {
    const data = parseBody(createPostSchema, request.body);
    const post = await this.service.create(data);

    response.status(201).json({ data: postDto(post) });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const id = parsePatchId(request.params.id);
    const data = parseBody(updatePostSchema, request.body);
    await this.service.update(id, data);

    response.status(204).send();
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);

    response.status(204).send();
  };
}
