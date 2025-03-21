import Joi from 'joi';
import { updatedUserProfileDTO } from '../../dtos/profile.dto';

export const updatedUserProfileSchema = Joi.object<updatedUserProfileDTO>({
  fullName: Joi.string().min(4),
  username: Joi.string().min(4).max(12),
  bio: Joi.string().min(4).max(100),
});
