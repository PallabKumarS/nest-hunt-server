import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../errors/AppError';
import { generateUserId } from '../../utils/generateID';
import { TUser } from './user.interface';
import UserModel from './user.model';
import httpStatus from 'http-status';

// create user into db
const createUserIntoDB = async (payload: Partial<TUser>) => {
  const isEmailExist = await UserModel.findOne({ email: payload.email });
  if (isEmailExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Email already exist. Login instead.',
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

// update user into db
const updateUserStatusIntoDB = async (userId: string) => {
  const isUserExist = await UserModel.findOne({ userId });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const result = await UserModel.findOneAndUpdate(
    { userId },
    { isActive: !isUserExist.isActive },
    {
      new: true,
    },
  );
  return result;
};

// update user into db
const updateUserIntoDB = async (
  userId: string,
  payload: Partial<TUser>,
  email: string,
) => {
  const isUserExist = await UserModel.isUserExists(email);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // check if user is updating his own profile
  if (isUserExist.role !== 'admin' && isUserExist.userId !== userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You can only update your own profile',
    );
  }

  // checking if  email is being used by another user
  const isEmailExist = await UserModel.findOne({ email: payload.email });

  if (isEmailExist && isUserExist.email !== payload.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Email already exist. Use another instead.',
    );
  }
  const result = await UserModel.findOneAndUpdate({ userId }, payload, {
    new: true,
  });
  return result;
};

// update user role into db
const updateUserRoleIntoDB = async (userId: string, role: string) => {
  const isUserExist = await UserModel.findOne({ userId });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (isUserExist.role === 'admin') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This user is an admin. You cannot change his role.',
    );
  }

  const result = await UserModel.findOneAndUpdate(
    {
      userId,
    },
    {
      role,
    },
    {
      new: true,
    },
  );
  return result;
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
  updateUserStatusIntoDB,
  updateUserRoleIntoDB,
};
