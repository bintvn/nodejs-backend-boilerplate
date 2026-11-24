import type { JwtPayload } from 'jsonwebtoken';
import type { UserEntity } from '../common/modules/user/user.entity.js';
import type { SessionEntity } from '../common/modules/session/session.entity.js';

export interface JwtConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiresInSeconds: number;
  refreshExpiresInSeconds: number;
  issuer: string;
  audience: string;
}

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  sid: string;
  email: string;
  roles: string[];
  type: 'access';
}

export interface RefreshTokenPayload extends JwtPayload {
  sub: string;
  sid: string;
  jti: string;
  type: 'refresh';
}

export interface ClientMetadata {
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
  metadata?: ClientMetadata;
}

export interface ChangePasswordInput {
  userId: UserEntity['id'];
  currentSessionId: SessionEntity['id'];
  oldPassword: string;
  newPassword: string;
  revokeOtherSessions?: boolean;
}

export interface AuthenticatedUser {
  id: UserEntity['id'];
  name: string;
  email: string;
  roles: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export type AuthResult = TokenPair & {};

export interface SessionInfo {
  id: SessionEntity['id'];
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  lastUsedAt: Date | null;
  expiresAt: Date;
  isCurrent: boolean;
}

export interface CurrentSessionResult {
  user: AuthenticatedUser;
  session: SessionInfo;
}
