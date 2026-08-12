import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

export function correlationIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
  req.correlationId = randomUUID();
  next();
}
