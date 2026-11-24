import type { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import type { DataSource } from 'typeorm';
import { createAuthRouter } from './auth.routes.js';
import type EmailService from '../email/email.service.js';
import type UserService from '../user/user.service.js';
import type RoleService from '../role/role.service.js';
import type SessionService from '../session/session.service.js';
import {
  JWT_ACCESS_EXPIRES_IN_SECOND,
  JWT_ACCESS_SECRET,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_REFRESH_EXPIRES_IN_SECOND,
  JWT_REFRESH_SECRET,
} from '../../constants.js';

export interface AuthModuleDependencies {
  emailService: EmailService;
  userService: UserService;
  roleService: RoleService;
  sessionService: SessionService;
}

export interface AuthModule {
  name: string;
  router: Router;
  controller: AuthController;
  service: AuthService;
}

const createAuthModule = (
  dataSource: DataSource,
  dependencies: AuthModuleDependencies,
): AuthModule => {
  const service = new AuthService(dataSource, dependencies, {
    accessSecret: JWT_ACCESS_SECRET,
    refreshSecret: JWT_REFRESH_SECRET,
    accessExpiresInSeconds: JWT_ACCESS_EXPIRES_IN_SECOND,
    refreshExpiresInSeconds: JWT_REFRESH_EXPIRES_IN_SECOND,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
  const controller = new AuthController(service);
  const router = createAuthRouter(controller, service);

  return {
    name: 'access-control',
    router,
    controller,
    service,
  };
};

export default createAuthModule;
