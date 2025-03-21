import { NextFunction, Request, Response } from 'express';
import userService from '../services/user.service';
import bcrypt from 'bcrypt';
import {
  createUserSchema,
  updateUserSchema,
} from '../utils/schemas/user.schema';

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const currentUserId = (req as any).user?.id;

      const users = await userService.getUsers(search, currentUserId);

      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      console.log('Menerima request untuk username:', username);
      const user = await userService.getUserByUsername(username);
      console.log('User ditemukan:', user);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const { _count, ...userWithoutCount } = user;
      const newUser = {
        ...userWithoutCount,
        followersCount: _count?.followers ?? 0,
        followingsCount: _count?.followings ?? 0,
      };

      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const { _count, ...userWithoutCount } = user;
      const newUser = {
        ...userWithoutCount,
        followersCount: _count?.followers ?? 0,
        followingsCount: _count?.followings ?? 0,
      };

      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async getSuggestedUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const users = await userService.getSuggestedUsers(id);

      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const validatedBody = await createUserSchema.validateAsync(body);
      const hashedPassword = await bcrypt.hash(validatedBody.password, 10);
      const user = await userService.createUser({
        ...validatedBody,
        password: hashedPassword,
      });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body;

      let user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          message: 'User not found!',
        });
        return;
      }

      const { email, username } = await updateUserSchema.validateAsync(body);

      if (email != '') {
        user.email = email;
      }

      if (username != '') {
        user.username = username;
      }

      const updatedUser = await userService.updateUserById(id, {
        email: user.email,
        username: user.username,
      });
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.deleteUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
