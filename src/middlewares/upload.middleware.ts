import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import streamifier from 'streamifier';

const whitelist = ['image/png', 'image/jpeg', 'image/jpg'];

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('File type not allowed'));
    }
    cb(null, true);
  },
});

export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) return next();

    const buffer = req.file.buffer;

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload();
    const url = (result as any).secure_url;

    if (req.originalUrl.includes('/profile')) {
      req.body.avatar = url;
    } else if (req.originalUrl.includes('/threads')) {
      req.body.images = url;
    }

    next();
  } catch (err) {
    console.error('Upload Cloudinary error:', err);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};
