import { z } from 'zod';
import {
  BadRequestError,
  ValidationError,
  type ErrorDetail,
} from './errors.js';

const uuid = z.uuid();
const maxDescriptionBytes = 65_535;

export const descriptionSchema = z
  .string()
  .refine((value) => Buffer.byteLength(value, 'utf8') <= maxDescriptionBytes, {
    message: 'Description must be at most 65,535 bytes in UTF-8',
  })
  .optional();

export function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (result.success) return result.data;

  const details = result.error.issues.flatMap<ErrorDetail>((issue) => {
    const path = issue.path.map(String).join('.');
    if (issue.code === 'unrecognized_keys') {
      return issue.keys.map((key) => ({
        field: path ? path + '.' + key : key,
        code: issue.code,
        message: 'Unrecognized field',
      }));
    }

    return [
      {
        ...(path && { field: path }),
        code: issue.code,
        message: issue.message,
      },
    ];
  });

  throw new ValidationError('Validation failed', details);
}

export function parsePatchId(value: string): string {
  if (!uuid.safeParse(value).success) {
    throw new BadRequestError('Invalid resource ID', [
      { field: 'id', code: 'invalid_format', message: 'Expected a UUID' },
    ]);
  }

  return value;
}
