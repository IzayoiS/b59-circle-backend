import { Follow } from '@prisma/client';

export type FollowedDTO = Pick<Follow, 'followedId'>;

export type FollowingsDTO = Pick<Follow, 'followingId'>;
