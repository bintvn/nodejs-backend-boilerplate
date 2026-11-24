import { baseDto } from '../../base.dto.js';
import { moduleDto } from '../modules/module.dto.js';
import { roleDto } from '../role/role.dto.js';
import type { AccessControlEntity } from './access-control.entity.js';

const accessControlDto = (accessControl: AccessControlEntity) => ({
  ...baseDto(accessControl),
  canRead: accessControl.canRead,
  canCreate: accessControl.canCreate,
  canUpdate: accessControl.canUpdate,
  canDelete: accessControl.canDelete,
  role: accessControl.role ? roleDto(accessControl.role) : null,
  module: accessControl.module ? moduleDto(accessControl.module) : null,
});

export default accessControlDto;
