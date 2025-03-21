import { NextFunction, Request, Response } from 'express';
import profileService from '../services/profile.service';

class ProfileController {
  async getUserProfileById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await profileService.getUserProfileById(id);

      if (!user) {
        res.status(404).json({
          message: 'User not found!',
        });
        return;
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/UpdateUserProfile"
                    }  
                }
            }
        } 
    */
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await profileService.getUserProfileById(id);

      if (!user) {
        res.status(404).json({
          message: 'User not found!',
        });
        return;
      }

      const { fullName, username, bio } = body;

      const updatedUser = await profileService.updateUserProfile(id, {
        fullName: fullName || user.fullName,
        username: username || user.user.username,
        bio: bio || user.bio,
      });

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController();
