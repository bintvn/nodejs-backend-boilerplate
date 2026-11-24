import type { Repository } from 'typeorm';
import type { SessionEntity } from './session.entity.js';
import { BaseService } from '../../base.service.js';

export default class SessionService extends BaseService<
  SessionEntity,
  Repository<SessionEntity>
> {
  name = 'session';

  constructor(readonly repository: Repository<SessionEntity>) {
    super(repository);
  }
}
