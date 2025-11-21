 import { UserService } from '../../src/services/UserService';
import { Pool } from 'pg';

describe('UserService - Unit Tests', () => {
  let userService: UserService;
  let mockPool: jest.Mocked<Pool>;

  beforeEach(() => {
    mockPool = {
      query: jest.fn(),
    } as unknown as jest.Mocked<Pool>;

    userService = new UserService(mockPool);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser = { name: 'John Doe', email: 'john@example.com' };
      const mockResult = { rows: [{ id: 1, ...mockUser }], rowCount: 1 };

      mockPool.query.mockResolvedValue(mockResult as any);

      const result = await userService.createUser(mockUser);

      expect(result).toEqual({ id: 1, ...mockUser });
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [mockUser.name, mockUser.email]
      );
    });

    it('should handle errors when creating user', async () => {
      const mockUser = { name: 'John Doe', email: 'john@example.com' };
      const error = new Error('Database error');

      mockPool.query.mockRejectedValue(error);

      await expect(userService.createUser(mockUser)).rejects.toThrow('Database error');
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
      const mockResult = { rows: [mockUser], rowCount: 1 };

      mockPool.query.mockResolvedValue(mockResult as any);

      const result = await userService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = $1',
        [1]
      );
    });

    it('should return null when user not found', async () => {
      const mockResult = { rows: [], rowCount: 0 };

      mockPool.query.mockResolvedValue(mockResult as any);

      const result = await userService.getUserById(999);

      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
      ];
      const mockResult = { rows: mockUsers, rowCount: 2 };

      mockPool.query.mockResolvedValue(mockResult as any);

      const result = await userService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockResult = { rows: [], rowCount: 1 };

      mockPool.query.mockResolvedValue(mockResult as any);

      const result = await userService.deleteUser(1);

      expect(result).toBe(true);
      expect(mockPool.query).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = $1',
        [1]
      );
    });

    it('should return false when user not found', async () => {
      const mockResult = { rows: [], rowCount: 0 };

      mockPool.query.mockResolvedValue(mockResult as any);

      const result = await userService.deleteUser(999);

      expect(result).toBe(false);
    });
  });
});
