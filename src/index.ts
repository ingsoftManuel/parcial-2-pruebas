import { createApp } from './app';
import { DatabaseConfig } from './config/database';

const PORT = process.env.PORT || 3000;

async function startServer() {
  // Inicializar base de datos
  await DatabaseConfig.ensureInitialized();
  
  const app = createApp();

  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` API available at http://localhost:${PORT}/api`);
    console.log(` Health check at http://localhost:${PORT}/health`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});