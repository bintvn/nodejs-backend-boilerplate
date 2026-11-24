import type { DataSource } from 'typeorm';
import { EmailEntity } from './email.entity.js';
import EmailService from './email.service.js';

export interface EmailModule {
  EmailEntity: typeof EmailEntity;
  service: EmailService;
}

const createEmailModule = (dataSource: DataSource): EmailModule => {
  const service = new EmailService(dataSource.getRepository(EmailEntity));

  return {
    EmailEntity,
    service,
  };
};

export default createEmailModule;
