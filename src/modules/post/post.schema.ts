import { z } from 'zod';

const title = z
  .string()
  .min(1)
  .max(255)
  .refine((value) => value.trim().length > 0);
const slug = z
  .string()
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?![\s\S])/);
const content = z.string().optional();

export const createPostSchema = z.strictObject({
  title,
  slug,
  content,
  categories: z.array(z.uuid()).optional(),
});
export const updatePostSchema = createPostSchema.partial();
export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
