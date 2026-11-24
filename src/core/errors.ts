export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    options?: {
      code?: string;
      isOperational?: boolean;
      details?: unknown;
      cause?: unknown;
    },
  ) {
    super(
      message,
      options?.cause !== undefined ? { cause: options.cause } : undefined,
    );

    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = options?.code ?? this.toScreamingSnakeCase(new.target.name);
    this.isOperational = options?.isOperational ?? statusCode < 500;
    this.details = options?.details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, new.target);
  }

  private toScreamingSnakeCase(value: string): string {
    return value
      .replace(/Error$/, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .toUpperCase();
  }
}

export class TokenExpiredError extends AppError {
  constructor(
    message = 'Token has expired',
    code: AuthErrorCode = 'TOKEN_EXPIRED',
    details: {
      expiredAt: Date;
    },
  ) {
    super(message, 401, { code, details });
  }
}

export class DatabaseError extends AppError {
  constructor(
    message = 'Database error',
    details?: unknown,
    code = 'DATABASE_ERROR',
  ) {
    super(message, 500, { code, details });
  }
}

export class BadRequestError extends AppError {
  constructor(
    message = 'Bad request',
    details?: unknown,
    code = 'BAD_REQUEST',
  ) {
    super(message, 400, { code, details });
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'Validation failed',
    details?: unknown,
    code = 'VALIDATION_ERROR',
  ) {
    super(message, 422, { code, details });
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message = 'Unauthorized',
    code = 'UNAUTHORIZED',
    details?: unknown,
  ) {
    super(message, 401, { code, details });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', code = 'FORBIDDEN', details?: unknown) {
    super(message, 403, { code, details });
  }
}

export class NotFoundError extends AppError {
  constructor(
    message = 'Resource not found',
    code = 'NOT_FOUND',
    details?: unknown,
  ) {
    super(message, 404, { code, details });
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(
    message = 'Method not allowed',
    code = 'METHOD_NOT_ALLOWED',
    details?: unknown,
  ) {
    super(message, 405, { code, details });
  }
}

export class ConflictError extends AppError {
  constructor(
    message = 'Resource conflict',
    code = 'CONFLICT',
    details?: unknown,
  ) {
    super(message, 409, { code, details });
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(
    message = 'Unprocessable entity',
    details?: unknown,
    code = 'UNPROCESSABLE_ENTITY',
  ) {
    super(message, 422, { code, details });
  }
}

export class TooManyRequestsError extends AppError {
  constructor(
    message = 'Too many requests',
    details?: unknown,
    code = 'TOO_MANY_REQUESTS',
  ) {
    super(message, 429, { code, details });
  }
}

export class InternalServerError extends AppError {
  constructor(
    message = 'Internal server error',
    options?: {
      code?: string;
      details?: unknown;
      cause?: unknown;
    },
  ) {
    super(message, 500, {
      code: options?.code ?? 'INTERNAL_SERVER_ERROR',
      isOperational: false,
      details: options?.details,
      cause: options?.cause,
    });
  }
}

export class BadGatewayError extends AppError {
  constructor(message = 'Bad gateway', code = 'BAD_GATEWAY', cause?: unknown) {
    super(message, 502, { code, isOperational: false, cause });
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(
    message = 'Service temporarily unavailable',
    code = 'SERVICE_UNAVAILABLE',
    cause?: unknown,
  ) {
    super(message, 503, { code, isOperational: true, cause });
  }
}

export class GatewayTimeoutError extends AppError {
  constructor(
    message = 'Gateway timeout',
    code = 'GATEWAY_TIMEOUT',
    cause?: unknown,
  ) {
    super(message, 504, { code, isOperational: false, cause });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'TOKEN_MISSING'
  | 'TOKEN_INVALID'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_REUSE_DETECTED'
  | 'SESSION_NOT_FOUND'
  | 'SESSION_REVOKED'
  | 'USER_NOT_FOUND';

export class AuthError extends Error {
  public readonly statusCode: number;
  public readonly code: AuthErrorCode;

  constructor(message: string, statusCode: number, code: AuthErrorCode) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.code = code;
  }
}
