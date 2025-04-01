import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { prisma } from '../libs/prisma';

class UserService {
  async getUsers(search?: string, currentUserId?: string) {
    const users = await prisma.user.findMany({
      where: search
        ? { OR: [{ username: { contains: search, mode: 'insensitive' } }] }
        : {},
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
        _count: {
          select: {
            followers: true,
            followings: true,
          },
        },
        followers: currentUserId
          ? {
              where: { followingId: currentUserId },
              select: { id: true },
            }
          : undefined,
      },
    });

    return users.map((user) => ({
      ...user,
      followersCount: user._count.followers,
      followingsCount: user._count.followings,
      isFollowed: user.followers && user.followers.length > 0,
    }));
  }

  async createUser(data: CreateUserDTO) {
    const { fullName, ...userData } = data;

    return await prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: {
            fullName,
          },
        },
      },
    });
  }

  async getUserById(id: string) {
    return await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        profile: true,
        followers: true,
        followings: true,
        _count: {
          select: {
            followers: true,
            followings: true,
          },
        },
      },
    });
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        profile: true,
        password: true,
        followers: true,
        followings: true,
        _count: {
          select: {
            followers: true,
            followings: true,
          },
        },
      },
    });
  }

  async getUserByUsernameForAuth(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });
  }

  async getUserByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        profile: true,
        followers: true,
        followings: true,
        _count: {
          select: {
            followers: true,
            followings: true,
          },
        },
      },
    });
  }

  async getSuggestedUsers(loggedInUserId: string) {
    const users = await prisma.user.findMany({
      where: {
        id: { not: loggedInUserId },
      },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
        followers: {
          select: { id: true },
        },
        followings: {
          select: { id: true },
        },
      },
    });

    const followings = await prisma.follow.findMany({
      where: {
        followingId: loggedInUserId,
      },
      select: {
        followedId: true,
      },
    });

    const followedUserIds = followings.map((f) => f.followedId);

    const filteredUsers = users
      .filter((user) => !followedUserIds.includes(user.id))
      .map((user) => {
        const hasFollowedMe = user.followers.some(
          (f) => f.id === loggedInUserId,
        );
        const iFollowHim = user.followings.some((f) => f.id === loggedInUserId);
        return { ...user, hasFollowedMe, iFollowHim };
      })
      .sort((a, b) => {
        if (b.hasFollowedMe !== a.hasFollowedMe) {
          return b.hasFollowedMe ? 1 : -1;
        }
        return b._count.followers - a._count.followers;
      });

    return filteredUsers.slice(0, 5);
  }

  async updateUserById(id: string, data: UpdateUserDTO) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUserById(id: string) {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }
}

export default new UserService();
