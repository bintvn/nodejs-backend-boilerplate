import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { createAuthMiddleware } from '../../middlewares/auth.middleware.js';
import type { AuthService } from './auth.service.js';

export function createAuthRouter(
  authController: AuthController,
  authService: AuthService,
): Router {
  const router = Router();
  const authenticate = createAuthMiddleware(authService);

  router.post('/sign-up', authController.signUp);
  router.post('/sign-in', authController.signin);
  router.post('/refresh', authController.refresh);
  router.get('/verify/email/:token', authController.verifyEmailToken);

  router.get('/me', authenticate, authController.me);
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

  return router;
}
