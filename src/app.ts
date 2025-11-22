import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { DatabaseConfig } from './config/database';
import { UserService } from './services/UserService';
import { TaskService } from './services/TaskService';
import { UserController } from './controllers/UserController';
import { TaskController } from './controllers/TaskController';
import { createUserRoutes } from './routes/userRoutes';
import { createTaskRoutes } from './routes/taskRoutes';

export function createApp(): Application {
  const app = express();
  const pool = DatabaseConfig.getPool();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Services
  const userService = new UserService(pool);
  const taskService = new TaskService(pool);

  // Controllers
  const userController = new UserController(userService);
  const taskController = new TaskController(taskService);

  // Routes
  app.use('/api/users', createUserRoutes(userController));
  app.use('/api/tasks', createTaskRoutes(taskController));

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  return app;
}