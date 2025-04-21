import { NextFunction, Request, Response } from 'express';
import profileService from '../services/profile.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import { updatedUserProfileSchema } from '../utils/schemas/profile.schema';

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
      // let uploadResult: UploadApiResponse = {} as UploadApiResponse;

      // if (req.file) {
      //   uploadResult = await cloudinary.uploader.upload(req.file.path);
      //   fs.unlinkSync(req.file.path);
      // }

      const body = {
        ...req.body,
        avatar: req.body.avatar || '',
      };

      const userId = (req as any).user.id;
      const validatedBody = await updatedUserProfileSchema.validateAsync(body);
      const updatedUser = await profileService.updateUserProfile(
        userId,
        validatedBody,
      );

      res.json({
        message: 'Profile updated successfully!',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController();
