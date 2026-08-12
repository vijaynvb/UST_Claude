import { Router } from 'express';
import type { UserController } from '../controllers/user.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/authenticate.middleware';

export function createUserRouter(controller: UserController): Router {
  const router = Router();

  router.get('/me', authenticate, asyncHandler(controller.getCurrentUser));

  return router;
}
