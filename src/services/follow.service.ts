import { prisma } from '../libs/prisma';

class FollowService {
  async getFollowById(followingId: string, followedId?: string) {
    if (followedId) {
      return await prisma.follow.findFirst({
        where: {
          followingId,
          followedId,
        },
      });
    } else {
      return await prisma.follow.findFirst({
        where: { id: followingId },
      });
    }
  }

  async getFollowers(userId: string, currentUserId: string) {
    const followers = await prisma.follow.findMany({
      where: { followedId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
    const followings = await prisma.follow.findMany({
      where: { followingId: currentUserId },
      select: { followedId: true },
    });

    const followingIds = followings.map((f) => f.followedId);

    return followers.map((f) => ({
      ...f,
      isFollowed: followingIds.includes(f.following.id),
    }));
  }

  async getFollowings(userId: string, currentUserId: string) {
    const followings = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        followed: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
    const userFollowings = await prisma.follow.findMany({
      where: { followingId: currentUserId },
      select: { followedId: true },
    });

    const followingIds = userFollowings.map((f) => f.followedId);

    return followings.map((f) => ({
      ...f,
      isFollowed: followingIds.includes(f.followed.id),
    }));
  }

  async createFollow(followingId: string, followedId: string) {
    return await prisma.follow.create({
      data: {
        followingId,
        followedId,
      },
    });
  }

  async deleteFollowById(followedId: string) {
    return await prisma.follow.delete({
      where: { id: followedId },
    });
  }

  async deleteFollowByFollowedId(followedId: string) {
    return prisma.follow.delete({
      where: { id: followedId },
    });
  }
}

export default new FollowService();
