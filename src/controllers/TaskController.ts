import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';

export class TaskController {
  constructor(private taskService: TaskService) {}

  public createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, user_id } = req.body;

      if (!title || !user_id) {
        res.status(400).json({ error: 'Title and user_id are required' });
        return;
      }

      const task = await this.taskService.createTask({
        title,
        description,
        is_completed: false,
        user_id
      });
      
      res.status(201).json(task);
    } catch (error: any) {
      if (error.code === '23503') {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(500).json({ error: 'Error creating task' });
      }
    }
  };

  public getTasksByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const tasks = await this.taskService.getTasksByUserId(userId);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  };

  public updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id);
      const { is_completed } = req.body;

      if (isNaN(taskId)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      if (typeof is_completed !== 'boolean') {
        res.status(400).json({ error: 'is_completed must be a boolean' });
        return;
      }

      const updated = await this.taskService.updateTaskStatus(taskId, is_completed);
      
      if (!updated) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating task' });
    }
  };

  public deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id);
      
      if (isNaN(taskId)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      const deleted = await this.taskService.deleteTask(taskId);
      
      if (!deleted) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting task' });
    }
  };
} 
