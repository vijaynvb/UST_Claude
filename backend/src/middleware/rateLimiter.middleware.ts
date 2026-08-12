import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import { env } from '../config/env';

export const authRateLimiter = rateLimit({
  windowMs: env.authRateLimit.windowMs,
  limit: env.authRateLimit.maxAttempts,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfterSeconds = Math.ceil(env.authRateLimit.windowMs / 1000);
    res.setHeader('Retry-After', String(retryAfterSeconds));
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
        correlationId: req.correlationId ?? randomUUID(),
      },
    });
  },
});
