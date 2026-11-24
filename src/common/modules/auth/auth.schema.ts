import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.email().max(255),
  password: z.string().min(8).max(128),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
  revokeOtherSessions: z.boolean().optional(),
});
