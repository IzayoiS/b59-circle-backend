import { NextFunction, Request, Response } from 'express';
import followService from '../services/follow.service';
import { followedSchema } from '../utils/schemas/follow.schema';

class FollowController {
  async createFollow(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/Follow"
                    }  
                }
            }
        } 
    */
    try {
      const body = req.body;
      const followingId = (req as any).user.id; // User yang melakukan follow
      const { followedId } = await followedSchema.validateAsync(body);

      const follow = await followService.getFollowById(followingId, followedId);

      if (follow) {
        res.status(400).json({ message: 'You cannot follow twice!' });
        return;
      }

      await followService.createFollow(followingId, followedId);
      res.json({ message: 'Follow success!' });
      return;
    } catch (error) {
      next(error);
    }
  }

  async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const currentUserId = userId;
      const followers = await followService.getFollowers(userId, currentUserId);
      res.json({ followers });
    } catch (error) {
      next(error);
    }
  }

  async getFollowings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const currentUserId = userId;
      const followings = await followService.getFollowings(
        userId,
        currentUserId,
      );
      res.json({ followings });
    } catch (error) {
      next(error);
    }
  }

  async deleteFollowById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const followingId = (req as any).user.id;

      const follow = await followService.getFollowById(followingId, id);
      console.log('follow', follow);

      if (!follow || follow.followingId !== followingId) {
        res.status(404).json({ message: 'Follow not found!' });
        return;
      }

      await followService.deleteFollowById(follow.id);
      res.json({ message: 'Unfollow success!' });
      return;
    } catch (error) {
      next(error);
    }
  }

  async deleteFollowByFollowedId(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/UnFollow"
                    }  
                }
            }
        } 
    */
    try {
      const { followedId } = req.params;

      if (!followedId) {
        res.status(400).json({ message: 'Follow ID is required' });
        return;
      }

      await followService.deleteFollowByFollowedId(followedId);
      res.status(200).json({ message: 'Unfollow successful' });
      return;
    } catch (error) {
      console.error('Error deleting follow:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}

export default new FollowController();
