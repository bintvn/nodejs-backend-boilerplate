import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { ZodError } from 'zod';
import { AuthController } from './auth.controller.js';
import { createAuthMiddleware } from '../../../middlewares/auth.middleware.js';
import { AuthError } from '../../errors.js';
import { authService } from '../../../bootstrap.js';

export function createAuthRouter(): Router {
  const router = Router();
  const authController = new AuthController(authService);
  const authenticate = createAuthMiddleware(authService);

  router.post('/sign-up', authController.signUp);
  router.post('/sign-in', authController.signin);
  router.post('/refresh', authController.refresh);
  router.get('/verify/email/:token', authController.verifyEmailToken);

  router.get('/session', authenticate, authController.session);
  router.get('/sessions', authenticate, authController.sessions);
  router.post('/sign-out', authenticate, authController.signout);
  router.post('/sign-out-all', authenticate, authController.signoutAll);
  router.delete(
    '/sessions/:sessionId',
    authenticate,
    authController.revokeSession,
  );
  router.post('/change-password', authenticate, authController.changePassword);

  router.use(
    (err: unknown, _req: Request, res: Response, next: NextFunction): void => {
      if (err instanceof AuthError) {
        res.status(err.statusCode).json({
          success: false,
          code: err.code,
          message: err.message,
        });
        return;
      }

      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          errors: err.issues,
        });
        return;
      }

      next(err);
    },
  );

  return router;
}
