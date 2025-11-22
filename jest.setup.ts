// Cargar variables de entorno desde .env antes de cualquier cosa
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar .env solo si existe (local)
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Configurar valores por defecto SOLO si no existen
if (!process.env.DB_USER) process.env.DB_USER = 'postgres';
if (!process.env.DB_HOST) process.env.DB_HOST = 'localhost';
if (!process.env.DB_PASSWORD) process.env.DB_PASSWORD = 'postgres';
if (!process.env.DB_PORT) process.env.DB_PORT = '5432';
