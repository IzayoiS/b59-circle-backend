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

  async updateUserProfile(
    id: string,
    data: { fullName: string; username: string; bio: string },
  ) {
    return await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: {
          username: data.username,
        },
      }),
      prisma.profile.update({
        where: { userId: id },
        data: {
          fullName: data.fullName,
          bio: data.bio,
        },
      }),
    ]);
  }
}

export default new ProfileService();
