import { baseDto } from '../../base.dto.js';
import type { ModuleEntity } from './module.entity.js';

export const moduleDto = (module: ModuleEntity) => ({
  ...baseDto(module),
  name: module.name,
  slug: module.slug,
  description: module.description,
});
