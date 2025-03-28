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

  async updateThread(
    userId: string,
    threadId: string,
    data: { content?: string },
  ) {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!thread || thread.userId !== userId) {
      return null;
    }

    return await prisma.thread.update({
      where: { id: threadId },
      data,
    });
  }

  async deleteThread(userId: string, threadId: string) {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!thread || thread.userId !== userId) {
      return null;
    }

    await prisma.thread.delete({
      where: { id: threadId },
    });

    return { message: 'Thread deleted successfully' };
  }
}

export default new ThreadService();
