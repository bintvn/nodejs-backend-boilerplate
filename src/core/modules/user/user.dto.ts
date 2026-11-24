import { baseDto } from '../../../core/base.dto.js';
import type { UserEntity } from './user.entity.js';

export const userDto = (user: UserEntity) => {
  return {
    ...baseDto(user),
    isEmailVerified: user.isEmailVerified,
    name: user.name,
    email: user.email,
  };
};
