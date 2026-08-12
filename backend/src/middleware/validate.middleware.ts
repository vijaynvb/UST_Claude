import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

type RequestPart = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, part: RequestPart = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const path = firstIssue?.path.join('.');
      const message = path ? `${path}: ${firstIssue?.message}` : firstIssue?.message ?? 'Invalid request.';
      next(AppError.badRequest(message));
      return;
    }

    req[part] = result.data;
    next();
  };
}
