import type { NextFunction, Request, Response } from 'express';
import { AuthError } from '../common/errors.js';
import type { AccessTokenPayload } from '../types/auth.types.js';
import type { AuthService } from '../common/modules/auth/auth.service.js';

export interface AuthenticatedRequest extends Request {
  auth?: AccessTokenPayload;
}

export function createAuthMiddleware(authService: AuthService) {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next(
        new AuthError(
          'Authorization Bearer header is required',
          401,
          'TOKEN_MISSING',
        ),
      );
      return;
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      next(new AuthError('Access token is empty', 401, 'TOKEN_MISSING'));

      return;
    }

    try {
      req.auth = authService.verifyAccessToken(token);

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
}

export function requireAuth(req: AuthenticatedRequest): AccessTokenPayload {
  if (!req.auth) throw new AuthError('Unauthorized', 401, 'TOKEN_MISSING');

  return req.auth;
}
