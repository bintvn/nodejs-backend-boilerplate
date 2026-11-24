import type { Request, Response } from 'express';
import type { AuthService } from './auth.service.js';
import {
  requireAuth,
  type AuthenticatedRequest,
} from '../../middlewares/auth.middleware.js';
import type { SessionEntity } from '../session/session.entity.js';
import { AuthError } from '../../errors.js';
import type { ClientMetadata } from '../../types/auth.types.js';
import {
  changePasswordSchema,
  refreshSchema,
  registerSchema,
  signInSchema,
} from './auth.schema.js';
import {
  COOKIE_EXPIRES_IN_SECOND,
  COOKIE_SECRET,
  IS_DEV,
} from '../../constants.js';
import { userDto } from '../user/user.dto.js';

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public signUp = async (req: Request, res: Response): Promise<void> => {
    const parsed = registerSchema.parse(req.body);
    await this.authService.register(parsed);

    res.status(201).json({
      success: true,
    });
  };

  public signin = async (req: Request, res: Response): Promise<void> => {
    const parsed = signInSchema.parse(req.body);
    const result = await this.authService.signin({
      ...parsed,
      metadata: this.extractMetadata(req),
    });

    this.setCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    const parsed = !req.body ? undefined : refreshSchema.parse(req.body);
    const cookieToken =
      typeof (req.signedCookies as Record<string, unknown>).token === 'string'
        ? (req.signedCookies as { token: string }).token
        : null;

    const refreshToken = parsed?.refreshToken || cookieToken;

    if (!refreshToken)
      throw new AuthError('Refresh token not found', 401, 'TOKEN_MISSING');

    const result = await this.authService.refresh(
      refreshToken,
      this.extractMetadata(req),
    );

    this.setCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  public me = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const auth = requireAuth(req);
    const data = await this.authService.me(auth.sub);

    res.status(200).json({
      success: true,
      data: userDto(data),
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

    this.clearCookie(res);

    res.status(200).json({
      success: true,
    });
  };

  public signoutAll = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const auth = requireAuth(req);
    await this.authService.signoutAll(auth.sub);

    this.clearCookie(res);

    res.status(200).json({
      success: true,
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

  public verifyEmailToken = async (
    request: Request<{ token: string }>,
    response: Response,
  ): Promise<void> => {
    const token = request.params.token;
    const result = await this.authService.verifyEmailToken(token);

    if (!result) throw new AuthError('Token tidak valid', 400, 'TOKEN_INVALID');

    response.status(200).json({
      success: true,
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

  private setCookie(res: Response, token: string): void {
    if (COOKIE_EXPIRES_IN_SECOND && COOKIE_SECRET)
      res.cookie('token', token, {
        signed: true,
        httpOnly: true,
        secure: !IS_DEV,
        sameSite: 'strict',
        maxAge: COOKIE_EXPIRES_IN_SECOND * 1000,
      });
  }

  private clearCookie(res: Response): void {
    if (COOKIE_EXPIRES_IN_SECOND && COOKIE_SECRET)
      res.clearCookie('token', {
        signed: true,
        httpOnly: true,
        secure: !IS_DEV,
        sameSite: 'strict',
      });
  }
}
