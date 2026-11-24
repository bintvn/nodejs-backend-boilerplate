import type { Request, Response } from 'express';
import type { AuthService } from './auth.service.js';
import {
  requireAuth,
  type AuthenticatedRequest,
} from '../../../middlewares/auth.middleware.js';
import type { SessionEntity } from '../session/session.entity.js';
import { AuthError } from '../../errors.js';
import type { ClientMetadata } from '../../../types/auth.types.js';
import {
  changePasswordSchema,
  refreshSchema,
  registerSchema,
  signInSchema,
} from './auth.schema.js';

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    const parsed = registerSchema.parse(req.body);
    const result = await this.authService.register(
      parsed,
      this.extractMetadata(req),
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  };

  public signin = async (req: Request, res: Response): Promise<void> => {
    const parsed = signInSchema.parse(req.body);
    const result = await this.authService.signin({
      ...parsed,
      metadata: this.extractMetadata(req),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    const parsed = refreshSchema.parse(req.body);
    const result = await this.authService.refresh(
      parsed.refreshToken,
      this.extractMetadata(req),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  public session = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const auth = requireAuth(req);
    const data = await this.authService.getSession(auth.sub, auth.sid);

    res.status(200).json({
      success: true,
      data,
    });
  };

  public sessions = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const auth = requireAuth(req);
    const data = await this.authService.getActiveSessions(auth.sub, auth.sid);

    res.status(200).json({
      success: true,
      data,
    });
  };

  public signout = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const auth = requireAuth(req);
    await this.authService.signout(auth.sid, auth.sub);

    res.status(200).json({
      success: true,
      message: 'Berhasil keluar dari sesi saat ini',
    });
  };

  public signoutAll = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const auth = requireAuth(req);
    await this.authService.signoutAll(auth.sub);

    res.status(200).json({
      success: true,
      message: 'Berhasil keluar dari semua sesi',
    });
  };

  public revokeSession = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const auth = requireAuth(req);
    const targetSessionId = req.params['sessionId'];

    if (!targetSessionId) {
      throw new AuthError(
        'Parameter sessionId wajib diisi',
        400,
        'SESSION_NOT_FOUND',
      );
    }

    await this.authService.revokeSession(
      auth.sub,
      targetSessionId as unknown as SessionEntity['id'],
    );

    res.status(200).json({
      success: true,
      message: 'Sesi berhasil dicabut',
    });
  };

  public changePassword = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const auth = requireAuth(req);
    const parsed = changePasswordSchema.parse(req.body);

    await this.authService.changePassword({
      userId: auth.sub,
      currentSessionId: auth.sid,
      oldPassword: parsed.oldPassword,
      newPassword: parsed.newPassword,
      ...(parsed.revokeOtherSessions !== undefined
        ? { revokeOtherSessions: parsed.revokeOtherSessions }
        : {}),
    });

    res.status(200).json({
      success: true,
      message: 'Password berhasil diperbarui',
    });
  };

  private extractMetadata(req: Request): ClientMetadata {
    const forwardedFor = req.headers['x-forwarded-for'];
    const rawIp = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(',')[0]?.trim();

    return {
      ipAddress: rawIp ?? req.ip ?? null,
      userAgent: req.headers['user-agent'] ?? null,
    };
  }
}
