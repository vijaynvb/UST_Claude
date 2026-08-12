import { Router } from 'express';
import type { Request, Response } from 'express';
import type { TaskController } from '../controllers/task.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/authenticate.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  taskCreateSchema,
  taskIdParamSchema,
  taskListQuerySchema,
  taskStatusUpdateSchema,
  taskUpdateSchema,
} from '../validators/task.validator';

function describeOptions(allow: string) {
  return (_req: Request, res: Response): void => {
    res.set('Allow', allow).status(204).send();
  };
}

export function createTaskRouter(controller: TaskController): Router {
  const router = Router();

  router
    .route('/')
    .get(authenticate, validate(taskListQuerySchema, 'query'), asyncHandler(controller.list))
    .post(authenticate, validate(taskCreateSchema), asyncHandler(controller.create))
    .options(describeOptions('GET, POST, OPTIONS'))
    .head(authenticate, validate(taskListQuerySchema, 'query'), asyncHandler(controller.headList));

  router
    .route('/:taskId')
    .all(validate(taskIdParamSchema, 'params'))
    .get(authenticate, asyncHandler(controller.getById))
    .put(authenticate, validate(taskUpdateSchema), asyncHandler(controller.update))
    .delete(authenticate, asyncHandler(controller.remove))
    .options(describeOptions('GET, PUT, DELETE, OPTIONS, HEAD'))
    .head(authenticate, asyncHandler(controller.headById));

  router.patch(
    '/:taskId/status',
    validate(taskIdParamSchema, 'params'),
    authenticate,
    validate(taskStatusUpdateSchema),
    asyncHandler(controller.updateStatus),
  );

  return router;
}
