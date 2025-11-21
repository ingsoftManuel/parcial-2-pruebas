 import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

export function createTaskRoutes(taskController: TaskController): Router {
  const router = Router();

  router.post('/', taskController.createTask);
  router.get('/user/:userId', taskController.getTasksByUser);
  router.patch('/:id', taskController.updateTaskStatus);
  router.delete('/:id', taskController.deleteTask);

  return router;
}
