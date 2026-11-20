import type { ErrorRequestHandler } from 'express';
import { isAppError } from '../common/errors.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (isAppError(error)) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
      ...(error.details !== undefined && { details: error.details }),
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
