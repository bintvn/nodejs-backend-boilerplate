import type { Request, Response } from 'express';
import { parseBody, parsePatchId } from '../../validation.js';
import type AccessControlService from './access-control.service.js';
import {
  createAccessControlSchema,
  updateAccessControlSchema,
} from './access-control.schema.js';
import accessControlDto from './access-control.dto.js';

export default class AccessControlController {
  readonly name = 'access-control';

  constructor(private readonly service: AccessControlService) {}

  getAll = async (_request: Request, response: Response) => {
    const accessControls = await this.service.getAll();

    response.json({ data: accessControls.map(accessControlDto) });
  };

  get = async (request: Request<{ id: string }>, response: Response) => {
    const accessControl = await this.service.get(request.params.id);

    if (!accessControl)
      throw new Error(`${this.name} with ID ${request.params.id} not found`);

    response.json({ data: accessControlDto(accessControl) });
  };

  create = async (request: Request, response: Response) => {
    const data = parseBody(createAccessControlSchema, request.body);
    const accessControl = await this.service.create(data);

    response.status(201).json({ data: accessControlDto(accessControl) });
  };

  update = async (request: Request<{ id: string }>, response: Response) => {
    const id = parsePatchId(request.params.id);
    const data = parseBody(updateAccessControlSchema, request.body);
    await this.service.update(id, data);

    response.status(204).send();
  };

  delete = async (request: Request<{ id: string }>, response: Response) => {
    await this.service.delete(request.params.id);

    response.status(204).send();
  };
}
