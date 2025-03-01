import QueryBuilder from "../../builder/QueryBuilder";
import { AppError } from "../../errors/AppError";
import { generateUserId } from "../../utils/generateID";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import httpStatus from "http-status";

// create user into db
const createUserIntoDB = async (payload: Partial<TUser>) => {
  const isEmailExist = await UserModel.findOne({ email: payload.email });
  if (isEmailExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email already exist. Login instead.",
    );
  }

  // set generated id
  payload.userId = await generateUserId(payload.role as string);

  // create a user
  const newUser = await UserModel.create(payload);

  return newUser;
};

// get personal details from db
const getMeFromDB = async (email: string) => {
  const result = await UserModel.findOne({ email });
  return result;
};

// change status of user
const updateUserIntoDB = async (userId: string, payload: Partial<TUser>) => {
  const result = await UserModel.findOneAndUpdate({ userId }, payload, {
    new: true,
  });
  return result;
};

// get all users
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(UserModel.find(), query)
    .filter()
    .sort()
    .paginate();

  const data = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    data,
  };
};

// delete user from db
const deleteUserFromDB = async (userId: string) => {
  const result = await UserModel.findOneAndUpdate(
    { userId },
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );
  return result;
};

export const UserService = {
  getAllUsersFromDB,
  deleteUserFromDB,
  updateUserIntoDB,
  getMeFromDB,
  createUserIntoDB,
};
