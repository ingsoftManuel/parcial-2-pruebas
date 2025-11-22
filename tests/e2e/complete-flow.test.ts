import request from 'supertest';
import { createApp } from '../../src/app';
import { DatabaseConfig } from '../../src/config/database';
import { Application } from 'express';

// FORZAR configuración para E2E en CI
if (process.env.CI || process.env.GITHUB_ACTIONS) {
  process.env.DB_USER = 'postgres';
  process.env.DB_HOST = 'localhost';
  process.env.DB_NAME = 'parcial_pruebas_e2e';
  process.env.DB_PASSWORD = 'postgres';
  process.env.DB_PORT = '5432';
} else {
  // Local: usar variables de entorno o defaults
  process.env.DB_NAME = process.env.DB_NAME || 'parcial_pruebas_e2e';
}

describe('E2E - Complete User Flow', () => {
  let app: Application;

  beforeAll(async () => {
    await DatabaseConfig.ensureInitialized();
    app = createApp();
    
    // Limpiar base de datos
    const pool = DatabaseConfig.getPool();
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    await DatabaseConfig.close();
  });

  it('should complete full user journey: create user, add tasks, update, and delete', async () => {
    console.log('Starting E2E Test: Complete User Flow');

    // ========== STEP 1: Create a user ==========
    console.log('Step 1: Creating user...');
    const userResponse = await request(app)
      .post('/api/users')
      .send({
        name: 'Alice Smith',
        email: 'alice@example.com'
      })
      .expect(201);

    const userId = userResponse.body.id;
    expect(userId).toBeDefined();
    expect(userResponse.body.name).toBe('Alice Smith');
    expect(userResponse.body.email).toBe('alice@example.com');
    console.log(`User created with ID: ${userId}`);

    // ========== STEP 2: Create multiple tasks ==========
    console.log('Step 2: Creating tasks...');
    const task1Response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Buy groceries',
        description: 'Milk, bread, eggs',
        user_id: userId
      })
      .expect(201);

    const task1Id = task1Response.body.id;
    expect(task1Id).toBeDefined();
    expect(task1Response.body.title).toBe('Buy groceries');
    console.log(`Task 1 created with ID: ${task1Id}`);

    const task2Response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Finish project',
        description: 'Complete the API',
        user_id: userId
      })
      .expect(201);

    const task2Id = task2Response.body.id;
    expect(task2Id).toBeDefined();
    console.log(`Task 2 created with ID: ${task2Id}`);

    const task3Response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Read documentation',
        description: 'PostgreSQL and TypeScript',
        user_id: userId
      })
      .expect(201);

    const task3Id = task3Response.body.id;
    console.log(`Task 3 created with ID: ${task3Id}`);

    // ========== STEP 3: List all tasks ==========
    console.log('Step 3: Listing all tasks...');
    const tasksResponse = await request(app)
      .get(`/api/tasks/user/${userId}`)
      .expect(200);

    expect(tasksResponse.body).toHaveLength(3);
    expect(tasksResponse.body[0].is_completed).toBe(false);
    expect(tasksResponse.body[1].is_completed).toBe(false);
    expect(tasksResponse.body[2].is_completed).toBe(false);
    console.log(`Found ${tasksResponse.body.length} tasks`);

    // ========== STEP 4: Complete first task ==========
    console.log('Step 4: Completing first task...');
    await request(app)
      .patch(`/api/tasks/${task1Id}`)
      .send({ is_completed: true })
      .expect(200);

    const updatedTasksResponse1 = await request(app)
      .get(`/api/tasks/user/${userId}`)
      .expect(200);

    const completedTask1 = updatedTasksResponse1.body.find((t: any) => t.id === task1Id);
    expect(completedTask1.is_completed).toBe(true);
    console.log(`Task ${task1Id} marked as completed`);

    // ========== STEP 5: Complete second task ==========
    console.log('Step 5: Completing second task...');
    await request(app)
      .patch(`/api/tasks/${task2Id}`)
      .send({ is_completed: true })
      .expect(200);

    const updatedTasksResponse2 = await request(app)
      .get(`/api/tasks/user/${userId}`)
      .expect(200);

    const completedTask2 = updatedTasksResponse2.body.find((t: any) => t.id === task2Id);
    expect(completedTask2.is_completed).toBe(true);
    console.log(`Task ${task2Id} marked as completed`);

    // ========== STEP 6: Delete third task ==========
    console.log('Step 6: Deleting third task...');
    await request(app)
      .delete(`/api/tasks/${task3Id}`)
      .expect(200);

    const finalTasksResponse = await request(app)
      .get(`/api/tasks/user/${userId}`)
      .expect(200);

    expect(finalTasksResponse.body).toHaveLength(2);
    const deletedTask = finalTasksResponse.body.find((t: any) => t.id === task3Id);
    expect(deletedTask).toBeUndefined();
    console.log(`Task ${task3Id} deleted successfully`);

    // ========== STEP 7: Verify remaining tasks ==========
    console.log('Step 7: Verifying remaining tasks...');
    const remainingTasks = finalTasksResponse.body;
    expect(remainingTasks).toHaveLength(2);
    
    const task1Final = remainingTasks.find((t: any) => t.id === task1Id);
    const task2Final = remainingTasks.find((t: any) => t.id === task2Id);
    
    expect(task1Final.is_completed).toBe(true);
    expect(task2Final.is_completed).toBe(true);
    console.log('Verified: 2 completed tasks remain');

    // ========== STEP 8: Verify user still exists ==========
    console.log('Step 8: Verifying user exists...');
    const userCheckResponse = await request(app)
      .get(`/api/users/${userId}`)
      .expect(200);

    expect(userCheckResponse.body.id).toBe(userId);
    expect(userCheckResponse.body.email).toBe('alice@example.com');
    console.log(`User ${userId} still exists`);

    // ========== STEP 9: Get all users ==========
    console.log('Step 9: Getting all users...');
    const allUsersResponse = await request(app)
      .get('/api/users')
      .expect(200);

    expect(allUsersResponse.body.length).toBeGreaterThan(0);
    const foundUser = allUsersResponse.body.find((u: any) => u.id === userId);
    expect(foundUser).toBeDefined();
    console.log(`Found user in users list`);

    // ========== STEP 10: Cascade delete test ==========
    console.log('Step 10: Testing cascade delete...');
    await request(app)
      .delete(`/api/users/${userId}`)
      .expect(200);

    const tasksAfterUserDelete = await request(app)
      .get(`/api/tasks/user/${userId}`)
      .expect(200);

    expect(tasksAfterUserDelete.body).toHaveLength(0);
    console.log(`All tasks deleted with user (CASCADE)`);

    console.log('E2E Test: Complete user flow passed successfully!');
  });

  it('should handle errors gracefully in complete flow', async () => {
    console.log('Starting E2E Test: Error Handling');

    // Try to create task for non-existent user
    console.log('Testing: Create task for non-existent user...');
    await request(app)
      .post('/api/tasks')
      .send({
        title: 'Invalid Task',
        user_id: 99999
      })
      .expect(404);
    console.log('Correctly returned 404 for invalid user');

    // Try to update non-existent task
    console.log('Testing: Update non-existent task...');
    await request(app)
      .patch('/api/tasks/99999')
      .send({ is_completed: true })
      .expect(404);
    console.log('Correctly returned 404 for invalid task');

    // Try to delete non-existent task
    console.log('Testing: Delete non-existent task...');
    await request(app)
      .delete('/api/tasks/99999')
      .expect(404);
    console.log('Correctly returned 404 when deleting invalid task');

    // Try to create user with duplicate email
    console.log('Testing: Create user with duplicate email...');
    await request(app)
      .post('/api/users')
      .send({ name: 'User 1', email: 'duplicate@test.com' })
      .expect(201);

    await request(app)
      .post('/api/users')
      .send({ name: 'User 2', email: 'duplicate@test.com' })
      .expect(409);
    console.log('Correctly returned 409 for duplicate email');

    console.log('E2E Test: Error handling passed successfully!');
  });
});