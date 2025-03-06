import { Model } from 'mongoose';
import { USER_ROLE } from './user.constants';

export interface TUser {
  userId?: string;
  name: string;
  email: string;
  role: 'admin' | 'tenant' | 'landlord';
  phone?: string;
  address?: string;
  password: string;
  passwordChangedAt?: Date;
  isDeleted?: boolean;
  isActive?: boolean;
  profileImage?: string;
}

export interface IUser extends Model<TUser> {
  isUserExists(email: string): Promise<TUser | null>;

  isPasswordMatched(
    myPlaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
