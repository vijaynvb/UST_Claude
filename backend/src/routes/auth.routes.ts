import { Router } from 'express';
import type { AuthController } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/authenticate.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, refreshSchema, registerSchema } from '../validators/auth.validator';

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  router.post(
    '/register',
    authRateLimiter,
    validate(registerSchema),
    asyncHandler(controller.register),
  );

  router.post('/login', authRateLimiter, validate(loginSchema), asyncHandler(controller.login));

  router.post(
    '/logout',
    authenticate,
    validate(refreshSchema),
    asyncHandler(controller.logout),
  );

  router.post('/refresh', validate(refreshSchema), asyncHandler(controller.refresh));

  return router;
}
