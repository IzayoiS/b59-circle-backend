import { NextFunction, Request, Response } from 'express';
import { CreateReplyDTO } from '../dtos/reply.dto';
import replyService from '../services/reply.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import { createReplySchema } from '../utils/schemas/reply.schema';

class ReplyController {
  async getRepliesByThreadId(req: Request, res: Response, next: NextFunction) {
    try {
      const { threadId } = req.params;

      if (!threadId) {
        res.status(400).json({ message: 'Thread ID is required' });
        return;
      }

      const replies = await replyService.getRepliesByThreadId(threadId);
      res.json({ replies });
    } catch (error) {
      next(error);
    }
  }

  async createReply(req: Request, res: Response, next: NextFunction) {
    try {
      let uploadResult: UploadApiResponse = {} as UploadApiResponse;

      if (req.file) {
        uploadResult = await cloudinary.uploader.upload(req.file.path || '');
        fs.unlinkSync(req.file.path);
      }
      console.log('Request body:', req.body);
      console.log('File:', req.file);

      const body = {
        ...req.body,
        images: uploadResult.secure_url ?? undefined,
      };

      const { threadId } = req.params;
      const userId = (req as any).user.id;
      const validatedBody = await createReplySchema.validateAsync(body);
      const reply = await replyService.createReply(
        userId,
        threadId,
        validatedBody,
      );

      res.status(201).json({
        message: 'Reply created!',
        data: { ...reply },
      });
    } catch (error) {
      next(error);
    }
  }
  // async createReply(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const userId = (req as any).user.id;
  //     const { threadId } = req.params;
  //     const data: CreateReplyDTO = req.body;

  //     if (!data.content) {
  //       res.status(400).json({ message: 'Content is required' });
  //       return;
  //     }

  //     const newReply = await replyService.createReply(userId, threadId, data);
  //     res.status(201).json(newReply);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export default new ReplyController();
