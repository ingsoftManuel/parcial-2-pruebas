 import { Router } from 'express';
import { UserController } from '../controllers/UserController';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  router.post('/', userController.createUser);
  router.get('/:id', userController.getUser);
  router.get('/', userController.getAllUsers);
  router.delete('/:id', userController.deleteUser);

  return router;
}
