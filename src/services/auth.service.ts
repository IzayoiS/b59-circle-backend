import { RegisterDTO } from '../dtos/auth.dto';
import { prisma } from '../libs/prisma';

class AuthService {
  async register(data: RegisterDTO) {
    const { fullName, username, ...userData } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUsername) {
      throw new Error('Username already registered');
    }

    return await prisma.user.create({
      data: {
        ...userData,
        username,
        profile: {
          create: {
            fullName,
          },
        },
      },
    });
  }

  async resetPassword(email: string, hashedNewPassword: string) {
    return await prisma.user.update({
      where: { email },
      data: {
        password: hashedNewPassword,
      },
    });
  }
}

export default new AuthService();
