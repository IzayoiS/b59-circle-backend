import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const user = process.env.NODEMAILER_USER_EMAIL || '';
const pass = process.env.NODEMAILER_USER_PASSWORD || '';

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user, pass },
});
