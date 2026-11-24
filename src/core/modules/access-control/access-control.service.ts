import type { Repository } from 'typeorm';
import { BaseService } from '../../base.service.js';
import { AccessControlEntity } from './access-control.entity.js';
import { type CreateAccessControl } from './access-control.schema.js';

export default class AccessControlService extends BaseService<
  AccessControlEntity,
  Repository<AccessControlEntity>
> {
  name = 'access-control';

  constructor(readonly repository: Repository<AccessControlEntity>) {
    super(repository);
  }

  create(data: CreateAccessControl) {
    return this.repository.manager.transaction(async (manager) => {
      const accessControlRepository =
        manager.getRepository(AccessControlEntity);

      const accessControl = accessControlRepository.create({
        role: {
          id: data.roleId,
        },
        module: {
          id: data.moduleId,
        },
        canCreate: data.canCreate,
        canRead: data.canRead,
        canUpdate: data.canUpdate,
        canDelete: data.canDelete,
      });

      return await accessControlRepository.save(accessControl);
    });
  }
}
