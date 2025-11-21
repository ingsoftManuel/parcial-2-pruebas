 export const getTestDatabaseConfig = (testType: 'unit' | 'integration' | 'e2e') => {
  const dbNames = {
    unit: 'ParcialPruebas2',
    integration: 'parcial_pruebas_test',
    e2e: 'parcial_pruebas_e2e'
  };

  return {
    user: 'postgres',
    host: 'localhost',
    database: dbNames[testType],
    password: 'eventia_pass',
    port: 5432
  };
};
