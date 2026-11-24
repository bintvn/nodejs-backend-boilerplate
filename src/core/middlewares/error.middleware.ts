import type { ErrorRequestHandler } from 'express';
import { QueryFailedError } from 'typeorm';
import {
  AppError,
  AuthError,
  BadRequestError,
  ConflictError,
  ValidationError,
  isAppError,
} from '../errors.js';
import { ZodError } from 'zod';

function normalizeError(error: unknown) {
  if (
    error instanceof SyntaxError &&
    'type' in error &&
    error.type === 'entity.parse.failed'
  ) {
    return new BadRequestError('Malformed JSON');
  }

  if (
    error instanceof Error &&
    'status' in error &&
    error.status === 413 &&
    'type' in error &&
    (error.type === 'entity.too.large' || error.type === 'parameters.too.many')
  ) {
    return new AppError('Request body is too large', 413, {
      code: 'PAYLOAD_TOO_LARGE',
    });
  }

  const driverError: unknown =
    error instanceof QueryFailedError ? error.driverError : undefined;
  if (driverError && typeof driverError === 'object' && 'code' in driverError) {
    switch (driverError.code) {
      case 'ER_DUP_ENTRY':
        return new ConflictError(
          'A record with the same unique value already exists',
        );
      case 'ER_ROW_IS_REFERENCED_2':
        return new ConflictError('This record is still referenced');
      case 'ER_NO_REFERENCED_ROW_2':
        return new ValidationError('A referenced record does not exist');
    }
  }

  return error;
}

export const errorHandler: ErrorRequestHandler = (
  caughtError: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(caughtError);
    return;
  }

  const error = normalizeError(caughtError);

  if (isAppError(error)) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
      ...(error.details !== undefined && { details: error.details }),
    });

    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      errors: error.issues,
    });

    return;
  }

  if (error instanceof AuthError) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
    });

    return;
  }

  console.error('Unhandled error:', error);

  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
  });
};
