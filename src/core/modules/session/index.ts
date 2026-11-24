import type { DataSource } from 'typeorm';
import { SessionEntity } from './session.entity.js';
import SessionService from './session.service.js';

export interface SessionModule {
  SessionEntity: typeof SessionEntity;
  service: SessionService;
}

const createSessionModule = (dataSource: DataSource): SessionModule => {
  return {
    SessionEntity: SessionEntity,
    service: new SessionService(dataSource.getRepository(SessionEntity)),
  };
};

export default createSessionModule;
