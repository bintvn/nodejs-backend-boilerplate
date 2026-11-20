import type { Repository } from 'typeorm';
import { BaseService } from '../../common/base.service.js';
import type { ModuleEntity } from '../../db/entities/module.entity.js';

export default class ModuleService extends BaseService<
  ModuleEntity,
  Repository<ModuleEntity>
> {
  name = 'module';

  constructor(protected readonly repository: Repository<ModuleEntity>) {
    super(repository);
  }
}
