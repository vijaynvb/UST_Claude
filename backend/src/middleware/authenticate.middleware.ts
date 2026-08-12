import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { verifyAccessToken } from '../utils/jwt';

const BEARER_PREFIX = 'Bearer ';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.header('Authorization');

  if (!header || !header.startsWith(BEARER_PREFIX)) {
    next(AppError.unauthorized());
    return;
  }

  const token = header.slice(BEARER_PREFIX.length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(AppError.unauthorized('Access token is missing, invalid, or expired.'));
  }
}
