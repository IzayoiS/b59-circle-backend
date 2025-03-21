import Joi from 'joi';
import { FollowedDTO, FollowingsDTO } from '../../dtos/follow.dto';

export const followedSchema = Joi.object<FollowedDTO>({
  followedId: Joi.string().uuid(),
});

export const followingsSchema = Joi.object<FollowingsDTO>({
  followingId: Joi.string().uuid(),
});
