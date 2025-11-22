import request from 'supertest';
import { createApp } from '../../src/app';
import { DatabaseConfig } from '../../src/config/database';
import { Application } from 'express';

describe('API Integration Tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = createApp();
    
    // Limpiar base de datos antes de las pruebas
    const pool = DatabaseConfig.getPool();
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    await DatabaseConfig.close();
  });

  describe('User Endpoints', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Jane Doe', email: 'jane@example.com' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Jane Doe');
      expect(response.body.email).toBe('jane@example.com');
    });

    it('should return 400 when missing required fields', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'John' })
        .expect(400);
    });

    it('should return 409 when email already exists', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'Duplicate', email: 'jane@example.com' })
        .expect(409);
    });

    it('should get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get user by id', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ name: 'Test User', email: 'test@example.com' });

      const userId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.name).toBe('Test User');
    });

    it('should return 404 when user not found', async () => {
      await request(app)
        .get('/api/users/99999')
        .expect(404);
    });

    it('should delete user successfully', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ name: 'Delete Me', email: 'delete@example.com' });

      const userId = createResponse.body.id;

      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });
  });

  describe('Task Endpoints', () => {
    let userId: number;

    beforeAll(async () => {
      const userResponse = await request(app)
        .post('/api/users')
        .send({ name: 'Task Owner', email: 'owner@example.com' });
      userId = userResponse.body.id;
    });

    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'This is a test',
          user_id: userId
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
      expect(response.body.is_completed).toBe(false);
    });

    it('should return 400 when missing required fields', async () => {
      await request(app)
        .post('/api/tasks')
        .send({ title: 'No User ID' })
        .expect(400);
    });

    it('should return 404 when user does not exist', async () => {
      await request(app)
        .post('/api/tasks')
        .send({
          title: 'Invalid User',
          user_id: 99999
        })
        .expect(404);
    });

    it('should get tasks by user id', async () => {
      const response = await request(app)
        .get(`/api/tasks/user/${userId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should update task status', async () => {
      const taskResponse = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Update Test',
          user_id: userId
        });

      const taskId = taskResponse.body.id;

      await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ is_completed: true })
        .expect(200);

      const tasks = await request(app)
        .get(`/api/tasks/user/${userId}`);

      const updatedTask = tasks.body.find((t: any) => t.id === taskId);
      expect(updatedTask.is_completed).toBe(true);
    });

    it('should return 400 when is_completed is not boolean', async () => {
      await request(app)
        .patch('/api/tasks/1')
        .send({ is_completed: 'invalid' })
        .expect(400);
    });

    it('should delete a task', async () => {
      const taskResponse = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Delete Test',
          user_id: userId
        });

      const taskId = taskResponse.body.id;

      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(200);

      const tasks = await request(app)
        .get(`/api/tasks/user/${userId}`);

      const deletedTask = tasks.body.find((t: any) => t.id === taskId);
      expect(deletedTask).toBeUndefined();
    });

    it('should return 404 when deleting non-existent task', async () => {
      await request(app)
        .delete('/api/tasks/99999')
        .expect(404);
    });
  });

  describe('Health Check', () => {
    it('should return OK status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});