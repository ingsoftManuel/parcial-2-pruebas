 import { Pool } from 'pg';
import { Task } from '../models/Task';

export class TaskService {
  constructor(private pool: Pool) {}

  public async createTask(task: Task): Promise<Task> {
    const query = `
      INSERT INTO tasks (title, description, is_completed, user_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [
      task.title, 
      task.description || null, 
      task.is_completed, 
      task.user_id
    ];
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  public async getTasksByUserId(userId: number): Promise<Task[]> {
    const query = 'SELECT * FROM tasks WHERE user_id = $1';
    const result = await this.pool.query(query, [userId]);
    
    return result.rows;
  }

  public async updateTaskStatus(taskId: number, isCompleted: boolean): Promise<boolean> {
    const query = 'UPDATE tasks SET is_completed = $1 WHERE id = $2';
    const result = await this.pool.query(query, [isCompleted, taskId]);
    
    return (result.rowCount ?? 0) > 0;
  }

  public async deleteTask(taskId: number): Promise<boolean> {
    const query = 'DELETE FROM tasks WHERE id = $1';
    const result = await this.pool.query(query, [taskId]);
    
    return (result.rowCount ?? 0) > 0;
  }

  public async getTaskById(taskId: number): Promise<Task | null> {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await this.pool.query(query, [taskId]);
    
    return result.rows[0] || null;
  }
}
