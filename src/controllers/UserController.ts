 import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  constructor(private userService: UserService) {}

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        res.status(400).json({ error: 'Name and email are required' });
        return;
      }

      const user = await this.userService.createUser({ name, email });
      res.status(201).json(user);
    } catch (error: any) {
      if (error.code === '23505') {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Error creating user' });
      }
    }
  };

  public getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const user = await this.userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  };

  public getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const deleted = await this.userService.deleteUser(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  };
}
