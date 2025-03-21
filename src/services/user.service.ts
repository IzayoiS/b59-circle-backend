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

  async getSuggestedUsers(userId: string) {
    return await prisma.user.findMany({
      where: {
        id: { not: userId },
        followers: {
          none: { id: userId },
        },
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
            followings: true,
          },
        },
      },
      take: 5,
    });
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
