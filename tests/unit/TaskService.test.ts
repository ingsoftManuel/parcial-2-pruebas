import { TaskService } from '../../src/services/TaskService';
import { Pool } from 'pg';

describe('TaskService - Unit Tests', () => {
  let taskService: TaskService;
  let mockPool: any;

  beforeEach(() => {
    mockPool = {
      query: jest.fn(),
    };

    taskService = new TaskService(mockPool as Pool);
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const mockTask = {
        title: 'Test Task',
        description: 'Test Description',
        is_completed: false,
        user_id: 1
      };
      
      mockPool.query.mockResolvedValue({
        rows: [{ id: 1, ...mockTask }],
        rowCount: 1
      });

      const result = await taskService.createTask(mockTask);

      expect(result).toEqual({ id: 1, ...mockTask });
      expect(mockPool.query).toHaveBeenCalled();
    });
  });

  describe('getTasksByUserId', () => {
    it('should return tasks for a user', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Desc 1', is_completed: false, user_id: 1 },
        { id: 2, title: 'Task 2', description: 'Desc 2', is_completed: true, user_id: 1 }
      ];
      
      mockPool.query.mockResolvedValue({
        rows: mockTasks,
        rowCount: 2
      });

      const result = await taskService.getTasksByUserId(1);

      expect(result).toEqual(mockTasks);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no tasks found', async () => {
      mockPool.query.mockResolvedValue({
        rows: [],
        rowCount: 0
      });

      const result = await taskService.getTasksByUserId(999);

      expect(result).toEqual([]);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status successfully', async () => {
      mockPool.query.mockResolvedValue({
        rows: [],
        rowCount: 1
      });

      const result = await taskService.updateTaskStatus(1, true);

      expect(result).toBe(true);
      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE tasks SET is_completed = $1 WHERE id = $2',
        [true, 1]
      );
    });

    it('should return false when task not found', async () => {
      mockPool.query.mockResolvedValue({
        rows: [],
        rowCount: 0
      });

      const result = await taskService.updateTaskStatus(999, true);

      expect(result).toBe(false);
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockPool.query.mockResolvedValue({
        rows: [],
        rowCount: 1
      });

      const result = await taskService.deleteTask(1);

      expect(result).toBe(true);
    });
  });

  describe('getTaskById', () => {
    it('should return task when found', async () => {
      const mockTask = { 
        id: 1, 
        title: 'Task', 
        description: 'Desc', 
        is_completed: false, 
        user_id: 1 
      };
      
      mockPool.query.mockResolvedValue({
        rows: [mockTask],
        rowCount: 1
      });

      const result = await taskService.getTaskById(1);

      expect(result).toEqual(mockTask);
    });

    it('should return null when task not found', async () => {
      mockPool.query.mockResolvedValue({
        rows: [],
        rowCount: 0
      });

      const result = await taskService.getTaskById(999);

      expect(result).toBeNull();
    });
  });
});