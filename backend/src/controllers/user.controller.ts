import type { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import type { UserService } from '../services/user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw AppError.unauthorized();
    const user = this.userService.getCurrentUser(req.user.id);
    res.status(200).json(user);
  };
}
