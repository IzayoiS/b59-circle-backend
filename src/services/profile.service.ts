import { updatedUserProfileDTO } from '../dtos/profile.dto';
import { prisma } from '../libs/prisma';

class ProfileService {
  async getUserProfileById(id: string) {
    return await prisma.profile.findFirst({
      where: {
        userId: id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async updateUserProfile(userId: string, data: updatedUserProfileDTO) {
    const { fullName, username, bio, avatar } = data;

    return await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        profile: {
          update: {
            fullName,
            bio,
            avatarUrl: avatar,
          },
        },
      },
      include: { profile: true },
    });
  }
}

export default new ProfileService();
