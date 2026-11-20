import type { Request, Response, NextFunction } from 'express';
import { REDIRECT_TRAILING_SLASH } from '../constants.js';

export function middleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (
    REDIRECT_TRAILING_SLASH &&
    request.path.endsWith('/') &&
    request.path.length > 1
  ) {
    const query = request.url.slice(request.path.length);
    const safePath =
      request.path.replace(/[\\/]+/g, '/').replace(/\/$/, '') || '/';
    response.redirect(308, safePath + query);
  } else {
    next();
  }
}
