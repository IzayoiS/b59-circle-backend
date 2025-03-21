import { Profile, User } from '@prisma/client';

type UserProfile = User & {
  fullName: Profile['fullName'];
};

export type RegisterDTO = Pick<
  UserProfile,
  'email' | 'username' | 'password' | 'fullName'
>;

export type ForgotPasswordDTO = Pick<UserProfile, 'email'>;

export type LoginDTO = Pick<User, 'password'> & { identifier: string };

export type ResetPasswordDTO = {
  oldPassword: string;
  newPassword: string;
};
