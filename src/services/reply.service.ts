import { CreateReplyDTO } from '../dtos/reply.dto';
import { prisma } from '../libs/prisma';

class ReplyService {
  async getRepliesByThreadId(threadId: string) {
    return await prisma.reply.findMany({
      where: { threadId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createReply(userId: string, threadId: string, data: CreateReplyDTO) {
    const { content, images } = data;
    return await prisma.reply.create({
      data: {
        images,
        threadId,
        content,
        userId,
      },
    });
  }
  // async createReply(userId: string, threadId: string, data: CreateReplyDTO) {
  //   return await prisma.reply.create({
  //     data: {
  //       userId,
  //       threadId,
  //       content: data.content,
  //     },
  //   });
  // }
}

export default new ReplyService();
