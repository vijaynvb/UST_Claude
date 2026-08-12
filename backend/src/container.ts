import { createDatabase } from './db/database';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refreshToken.repository';
import { TaskRepository } from './repositories/task.repository';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TaskService } from './services/task.service';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { TaskController } from './controllers/task.controller';

export function createContainer() {
  const db = createDatabase();

  const userRepository = new UserRepository(db);
  const refreshTokenRepository = new RefreshTokenRepository(db);
  const taskRepository = new TaskRepository(db);

  const authService = new AuthService(userRepository, refreshTokenRepository);
  const userService = new UserService(userRepository);
  const taskService = new TaskService(taskRepository);

  const authController = new AuthController(authService);
  const userController = new UserController(userService);
  const taskController = new TaskController(taskService);

  return { db, authController, userController, taskController };
}

export type AppContainer = ReturnType<typeof createContainer>;
