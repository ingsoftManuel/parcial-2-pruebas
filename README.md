# To-Do API REST - Gestión de Tareas

API REST completa para gestión de tareas desarrollada con **Node.js**, **TypeScript**, **Express** y **PostgreSQL**. Incluye arquitectura por capas, pruebas automatizadas completas y pipeline de CI/CD con GitHub Actions.

![Build Status](https://github.com/ingsoftManuel/parcial-2-pruebas/workflows/CI%20Pipeline/badge.svg)
[![Coverage](https://img.shields.io/badge/coverage-86%25-brightgreen.svg)](https://github.com/ingsoftManuel/parcial-2-pruebas)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)

---

## Características

- API REST completa con operaciones CRUD
- Arquitectura por capas (modelos, servicios, controladores, rutas)
- TypeScript con tipado fuerte
- PostgreSQL como base de datos relacional
- 33 pruebas automatizadas (unitarias, integración, E2E)
- 86% de cobertura de código
- CI/CD con GitHub Actions
- ESLint para análisis estático
- Integridad referencial con CASCADE DELETE

---

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Pruebas](#pruebas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [CI/CD Pipeline](#cicd-pipeline)
- [Tecnologías](#tecnologías)

---

## Requisitos

- **Node.js** 18 o superior
- **PostgreSQL** 12 o superior
- **npm** o **yarn**

---

## Instalación
```bash
# Clonar el repositorio
git clone https://github.com/ingsoftManuel/parcial-2-pruebas.git
cd parcial-2-pruebas

# Instalar dependencias
npm install
```

---

## Configuración

### 1. Crear bases de datos en PostgreSQL
```sql
CREATE DATABASE ParcialPruebas2;
CREATE DATABASE parcial_pruebas_test;
CREATE DATABASE parcial_pruebas_e2e;
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ParcialPruebas2
DB_PASSWORD=tu_password
DB_PORT=5432

PORT=3000
NODE_ENV=development
```

### 3. Las tablas se crean automáticamente

Al iniciar el servidor, las tablas `users` y `tasks` se crean automáticamente.

---

## Uso

### Desarrollo
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### Producción
```bash
# Compilar TypeScript
npm run build

# Ejecutar servidor
npm start
```

---

## API Endpoints

### Health Check
```http
GET /health
```

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-21T20:00:00.000Z"
}
```

---

### Usuarios

#### Crear usuario
```http
POST /api/users
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

**Respuesta (201 Created):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

#### Listar todos los usuarios
```http
GET /api/users
```

**Respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
]
```

#### Obtener usuario por ID
```http
GET /api/users/:id
```

**Respuesta (200 OK):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

#### Eliminar usuario
```http
DELETE /api/users/:id
```

**Respuesta (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

### Tareas

#### Crear tarea
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Comprar leche",
  "description": "En el supermercado",
  "user_id": 1
}
```

**Respuesta (201 Created):**
```json
{
  "id": 1,
  "title": "Comprar leche",
  "description": "En el supermercado",
  "is_completed": false,
  "user_id": 1
}
```

#### Listar tareas de un usuario
```http
GET /api/tasks/user/:userId
```

**Respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Comprar leche",
    "description": "En el supermercado",
    "is_completed": false,
    "user_id": 1
  }
]
```

#### Actualizar estado de tarea
```http
PATCH /api/tasks/:id
Content-Type: application/json

{
  "is_completed": true
}
```

**Respuesta (200 OK):**
```json
{
  "message": "Task updated successfully"
}
```

#### Eliminar tarea
```http
DELETE /api/tasks/:id
```

**Respuesta (200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Pruebas
```bash
# Ejecutar todas las pruebas con cobertura
npm test

# Solo pruebas unitarias
npm run test:unit

# Solo pruebas de integración
npm run test:integration

# Solo pruebas E2E
npm run test:e2e

# Análisis estático con ESLint
npm run lint
npm run lint:fix
```

### Cobertura de Código
```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   86.33 |    75.86 |   96.55 |   86.81 |
 src                |     100 |      100 |     100 |     100 |
 src/config         |   73.68 |    78.57 |      75 |   77.77 |
 src/controllers    |   78.26 |       75 |     100 |   78.26 |
 src/routes         |     100 |      100 |     100 |     100 |
 src/services       |     100 |       75 |     100 |     100 |
--------------------|---------|----------|---------|---------|
```

### Resultados de Pruebas

- **Test Suites:** 4 passed, 4 total
- **Tests:** 33 passed, 33 total
- **Snapshots:** 0 total
- **Time:** ~5-7 seconds

---

## Estructura del Proyecto
```
parcial-2-pruebas/
├── .github/
│   └── workflows/
│       └── ci.yml           # Pipeline de CI/CD
├── src/
│   ├── config/
│   │   └── database.ts      # Configuración de PostgreSQL
│   ├── models/
│   │   ├── User.ts          # Modelo de Usuario
│   │   └── Task.ts          # Modelo de Tarea
│   ├── services/
│   │   ├── UserService.ts   # Lógica de negocio de usuarios
│   │   └── TaskService.ts   # Lógica de negocio de tareas
│   ├── controllers/
│   │   ├── UserController.ts # Controlador HTTP de usuarios
│   │   └── TaskController.ts # Controlador HTTP de tareas
│   ├── routes/
│   │   ├── userRoutes.ts    # Rutas de usuarios
│   │   └── taskRoutes.ts    # Rutas de tareas
│   ├── app.ts               # Configuración de Express
│   └── index.ts             # Punto de entrada
├── tests/
│   ├── unit/                # Pruebas unitarias
│   │   ├── UserService.test.ts
│   │   └── TaskService.test.ts
│   ├── integration/         # Pruebas de integración
│   │   └── api.test.ts
│   └── e2e/                 # Pruebas end-to-end
│       └── complete-flow.test.ts
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore
├── jest.config.js           # Configuración de Jest
├── tsconfig.json            # Configuración de TypeScript
├── tsconfig.test.json       # Configuración de TypeScript para tests
├── package.json
└── README.md
```

---

## CI/CD Pipeline

El proyecto incluye un pipeline de GitHub Actions que se ejecuta automáticamente en cada push y pull request:

### Pasos del Pipeline

1. **Checkout** del código
2. **Setup** de Node.js 18
3. **Instalación** de dependencias con `npm ci`
4. **Setup** de PostgreSQL 15 como servicio
5. **Creación** de bases de datos de prueba
6. **ESLint** - Análisis estático de código
7. **Pruebas unitarias** - Validación de servicios
8. **Pruebas de integración** - Validación de endpoints
9. **Pruebas E2E** - Flujo completo de usuario
10. **Reporte de cobertura** - Validación de umbrales

### Resultado Exitoso

Si todas las pruebas pasan, el pipeline imprime:
```
============================================
OK - All tests and linting passed!
============================================
Summary:
  ESLint (Static Analysis): PASSED
  Unit Tests: PASSED
  Integration Tests: PASSED
  E2E Tests: PASSED
  Code Coverage: PASSED
============================================
```

---

## Tecnologías

### Backend
- **Runtime:** Node.js 18+
- **Lenguaje:** TypeScript 5.1+
- **Framework:** Express 4.18+
- **Base de datos:** PostgreSQL 15+
- **Cliente DB:** pg (node-postgres) 8.11+

### Testing
- **Framework:** Jest 29.5+
- **HTTP Testing:** Supertest 6.3+
- **Cobertura:** Jest Coverage

### Calidad de Código
- **Linting:** ESLint 8.43+
- **Parser:** @typescript-eslint/parser 5.59+

### CI/CD
- **Platform:** GitHub Actions
- **Node Version:** 18
- **PostgreSQL Version:** 15

---

## Base de Datos

### Tabla `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);
```

**Campos:**
- `id`: Identificador único autoincremental
- `name`: Nombre del usuario (requerido)
- `email`: Correo electrónico único (requerido)

### Tabla `tasks`
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Campos:**
- `id`: Identificador único autoincremental
- `title`: Título de la tarea (requerido)
- `description`: Descripción detallada (opcional)
- `is_completed`: Estado de completitud (por defecto: false)
- `user_id`: Referencia al usuario propietario (requerido, con CASCADE DELETE)

---

## Buenas Prácticas Implementadas

- **Separación de responsabilidades** con arquitectura por capas
- **Inyección de dependencias** en controladores
- **Tipado fuerte** con TypeScript
- **Validación de entrada** en controladores
- **Manejo de errores** HTTP apropiados (400, 404, 409, 500)
- **Connection pooling** con pg
- **Pruebas exhaustivas** con >85% de cobertura
- **Análisis estático** con ESLint
- **CI/CD automatizado** con GitHub Actions
- **Integridad referencial** en base de datos

---

## Manejo de Errores

La API devuelve códigos HTTP apropiados:

- **200 OK** - Operación exitosa
- **201 Created** - Recurso creado exitosamente
- **400 Bad Request** - Datos de entrada inválidos
- **404 Not Found** - Recurso no encontrado
- **409 Conflict** - Email duplicado
- **500 Internal Server Error** - Error del servidor

Ejemplo de respuesta de error:
```json
{
  "error": "Email already exists"
}
```

---

## Desarrollo

### Comandos Disponibles
```bash
# Desarrollo con hot-reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar versión compilada
npm start

# Ejecutar todas las pruebas
npm test

# Pruebas por tipo
npm run test:unit
npm run test:integration
npm run test:e2e

# Linting
npm run lint
npm run lint:fix
```

### Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

El CI/CD verificará automáticamente:
- Análisis estático con ESLint
- Todas las pruebas pasen
- Cobertura de código sea mayor a 70%

---

## Autor

**Juan Manuel Rodríguez**  
GitHub: [@ingsoftManuel](https://github.com/ingsoftManuel)



**Desarrollado con TypeScript, Express, PostgreSQL y Jest**