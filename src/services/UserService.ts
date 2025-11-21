 import { Pool } from 'pg';
import { User } from '../models/User';

export class UserService {
  constructor(private pool: Pool) {}

  public async createUser(user: User): Promise<User> {
    const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
    const values = [user.name, user.email];
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  public async getUserById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    return result.rows[0] || null;
  }

  public async getAllUsers(): Promise<User[]> {
    const query = 'SELECT * FROM users';
    const result = await this.pool.query(query);
    
    return result.rows;
  }

  public async deleteUser(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    return (result.rowCount ?? 0) > 0;
  }
}
