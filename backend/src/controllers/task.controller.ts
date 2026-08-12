import type { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import type { TaskService } from '../services/task.service';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const result = this.taskService.list(this.requireUserId(req), req.query as never);
    res.status(200).json(result);
  };

  headList = async (req: Request, res: Response): Promise<void> => {
    this.taskService.list(this.requireUserId(req), req.query as never);
    res.status(200).end();
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const task = this.taskService.getById(this.requireUserId(req), req.params.taskId as string);
    res.status(200).json(task);
  };

  headById = async (req: Request, res: Response): Promise<void> => {
    this.taskService.getById(this.requireUserId(req), req.params.taskId as string);
    res.status(200).end();
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const task = this.taskService.create(this.requireUserId(req), req.body);
    res.status(201).json(task);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const task = this.taskService.update(
      this.requireUserId(req),
      req.params.taskId as string,
      req.body,
    );
    res.status(200).json(task);
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const task = this.taskService.updateStatus(
      this.requireUserId(req),
      req.params.taskId as string,
      req.body,
    );
    res.status(200).json(task);
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    this.taskService.delete(this.requireUserId(req), req.params.taskId as string);
    res.status(204).send();
  };

  private requireUserId(req: Request): string {
    if (!req.user) throw AppError.unauthorized();
    return req.user.id;
  }
}
