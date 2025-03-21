import { CreateThreadDTO } from '../dtos/thread.dto';
import { prisma } from '../libs/prisma';

class ThreadService {
  async getThreads() {
    return await prisma.thread.findMany({
      include: {
        user: {
          omit: {
            password: true,
          },
          include: {
            profile: true,
          },
        },
        replies: true,
        likes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getThreadById(id: string) {
    return await prisma.thread.findFirst({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: true,
        replies: true,
      },
    });
  }

  async getThreadsByUserId(userId: string) {
    return await prisma.thread.findMany({
      where: { userId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        replies: true,
        likes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createThread(userId: string, data: CreateThreadDTO) {
    const { content, images } = data;
    return await prisma.thread.create({
      data: {
        images,
        content,
        userId,
      },
    });
  }
}

export default new ThreadService();
