import { Router } from 'express';
import type { AppContainer } from '../container';
import { createAuthRouter } from './auth.routes';
import { createUserRouter } from './user.routes';
import { createTaskRouter } from './task.routes';

export function createApiRouter(container: AppContainer): Router {
  const router = Router();

  router.use('/auth', createAuthRouter(container.authController));
  router.use('/users', createUserRouter(container.userController));
  router.use('/tasks', createTaskRouter(container.taskController));

  // Generic CORS preflight fallback for routes without a spec-defined OPTIONS
  // response; cors() runs in preflightContinue mode so its headers are already set.
  router.options('*', (_req, res) => {
    res.status(204).end();
  });

  return router;
}
