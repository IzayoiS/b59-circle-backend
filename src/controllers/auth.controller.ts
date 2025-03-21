import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import authService from '../services/auth.service';
import userService from '../services/user.service';
import {
  forgotPasswordSchema,
  LoginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../utils/schemas/auth.schema';
import Jwt from 'jsonwebtoken';
import { transporter } from '../libs/nodemailer';
import { RegisterDTO } from '../dtos/auth.dto';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/LoginDTO"
                    }  
                }
            }
        } 
    */

    try {
      const body = req.body;
      const { identifier, password } = await LoginSchema.validateAsync(body);
      const user = identifier.includes('@')
        ? await userService.getUserByEmail(identifier)
        : await userService.getUserByUsernameForAuth(identifier);

      if (!user) {
        res.status(404).json({
          message: 'Email/username or password is wrong!',
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({
          message: 'Email/username or password is wrong!',
        });
        return;
      }

      const jwtsecret = process.env.JWT_SECRET || '';

      const token = Jwt.sign(
        {
          id: user.id,
        },
        jwtsecret,
        {
          expiresIn: '10h',
        },
      );

      const { password: unusedPassword, ...userResponse } = user;

      res.status(200).json({
        message: 'Login success!',
        data: {
          user: userResponse,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/RegisterDTO"
                    }  
                }
            }
        } 
    */

    try {
      const body = req.body;
      const validatedBody = await registerSchema.validateAsync(body);
      const hashedPassword = await bcrypt.hash(validatedBody.password, 10);

      const registerBody: RegisterDTO = {
        ...validatedBody,
        password: hashedPassword,
      };

      const user = await authService.register(registerBody);
      res.status(200).json({
        message: 'Registration successful!',
        data: { ...user },
      });
    } catch (error) {
      next(error);
    }
  }

  async check(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = (req as any).user;
      const user = await userService.getUserById(payload.id);

      if (!user) {
        res.status(404).json({
          message: 'User not found!',
        });
        return;
      }

      const { _count, ...userResponse } = user;
      const followersCount = _count?.followers ?? 0;
      const followingsCount = _count?.followings ?? 0;

      res.status(200).json({
        message: 'User check success!',
        data: { ...userResponse, followersCount, followingsCount },
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/ForgotPasswordDTO"
                      }  
                  }
              }
          } 
      */
    try {
      const body = req.body;
      const { email } = await forgotPasswordSchema.validateAsync(body);

      const jwtSecret = process.env.JWT_SECRET || '';

      const token = Jwt.sign({ email }, jwtSecret, {
        expiresIn: '2 days',
      });

      const frontendUrl = process.env.FRONTEND_BASE_URL || '';
      const resetPasswordLink = `${frontendUrl}/reset-password?token=${token}`;

      const mailOptions = {
        from: 'suryaelidanto@gmail.com',
        to: email,
        subject: 'Circe | Forgot Password',
        html: `
        <h1>This is link for reset password:</h1>
        <a href="${resetPasswordLink}">${resetPasswordLink}</a>  
        `,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({
        message: 'Forgot password link sent!',
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
                  required: true,
                  content: {
                      "application/json": {
                          schema: {
                              $ref: "#/components/schemas/ResetPasswordDTO"
                          }  
                      }
                  }
              } 
          */

    try {
      const payload = (req as any).user;
      const body = req.body;
      const { oldPassword, newPassword } =
        await resetPasswordSchema.validateAsync(body);

      if (oldPassword === newPassword) {
        res.status(400).json({
          message: 'Password cannot be the same as previous!',
        });
        return;
      }

      const user = await userService.getUserByEmail(payload.email);

      if (!user) {
        res.status(404).json({
          message: 'User not found!',
        });
        return;
      }

      const isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password,
      );

      if (!isOldPasswordCorrect) {
        res.status(400).json({
          message: 'Old password is not correct!',
        });
        return;
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      const { password, ...updatedUserPassword } =
        await authService.resetPassword(user.email, hashedNewPassword);

      res.status(200).json({
        message: 'Reset password success!',
        data: { ...updatedUserPassword },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
