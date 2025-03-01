import { UserModel } from "./user.model";

// get all user from db 
const getAllUserFromDB = async () => {
  const result = await UserModel.find();
  return result;
};

export const UserService = { getAllUserFromDB };
