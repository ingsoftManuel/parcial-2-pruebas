import { Pool, PoolConfig } from 'pg';

export class DatabaseConfig {
  private static pool: Pool;

  public static getPool(): Pool {
    if (!DatabaseConfig.pool) {
      const config: PoolConfig = {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'ParcialPruebas2',
        password: process.env.DB_PASSWORD || 'eventia_pass',
        port: parseInt(process.env.DB_PORT || '5432'),
      };

      DatabaseConfig.pool = new Pool(config);
      DatabaseConfig.initialize();
    }
    return DatabaseConfig.pool;
  }

  private static async initialize(): Promise<void> {
    const pool = DatabaseConfig.pool;

    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          is_completed BOOLEAN DEFAULT FALSE,
          user_id INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      console.log('✅ Database tables initialized');
    } catch (error) {
      console.error('❌ Error initializing database:', error);
    }
  }

  public static async close(): Promise<void> {
    if (DatabaseConfig.pool) {
      await DatabaseConfig.pool.end();
    }
  }
}