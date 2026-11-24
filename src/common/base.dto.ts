import type { BaseEntity } from '../db/base.entity.js';

export const baseDto = (data: BaseEntity) => {
  return {
    id: data.id,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    disabled: data.disabled,
  };
};
