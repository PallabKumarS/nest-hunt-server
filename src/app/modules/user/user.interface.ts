import { Model } from "mongoose";
import { USER_ROLE } from "./user.constants";

export interface TUser {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
  phone: string;
  address: string;
  password: string;
  passwordChangedAt?: Date;
}

export interface IUser extends Model<TUser> {
  isUserExists(email: string): Promise<TUser>;

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
