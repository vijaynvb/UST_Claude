import type { Request, Response } from 'express';
import type { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const user = await this.authService.register(req.body);
    res.status(201).json(user);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const tokens = await this.authService.login(req.body);
    res.status(200).json(tokens);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    this.authService.logout(req.body.refreshToken);
    res.status(204).send();
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const tokens = await this.authService.refresh(req.body.refreshToken);
    res.status(200).json(tokens);
  };
}
