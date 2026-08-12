import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const correlationId = req.correlationId;
  const appError = err instanceof AppError ? err : AppError.internal();

  if (!(err instanceof AppError)) {
    logger.error('unhandled_error', {
      correlationId,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  } else if (appError.statusCode >= 500) {
    logger.error('app_error', { correlationId, code: appError.code, message: appError.message });
  }

  res.status(appError.statusCode).json({
    error: {
      code: appError.code,
      message: appError.message,
      correlationId,
    },
  });
}
