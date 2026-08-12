import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '../models/task.model';

const priority = z.enum(TASK_PRIORITIES as [string, ...string[]]);
const status = z.enum(TASK_STATUSES as [string, ...string[]]);
const isoDateTime = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'must be a valid ISO 8601 date-time',
});

export const taskCreateSchema = z
  .object({
    title: z.string().trim().min(1).max(255),
    description: z.string().max(4000).nullable().optional(),
    dueDate: isoDateTime.nullable().optional(),
    priority: priority.optional(),
  })
  .strict();

export const taskUpdateSchema = z
  .object({
    title: z.string().trim().min(1).max(255),
    description: z.string().max(4000).nullable().optional(),
    dueDate: isoDateTime.nullable().optional(),
    priority: priority.optional(),
    status: status.optional(),
  })
  .strict();

export const taskStatusUpdateSchema = z
  .object({
    status,
  })
  .strict();

export const taskListQuerySchema = z.object({
  status: status.optional(),
  priority: priority.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['dueDate', 'priority', 'createdAt']).default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});

export const taskIdParamSchema = z.object({
  taskId: z.string().uuid(),
});
