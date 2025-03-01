import { Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// create user controller
const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is created successfully",
    data: result,
  });
});

// get personal details
const getMe = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserService.getMeFromDB(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is retrieved successfully",
    data: result,
  });
});

// change status
const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const result = await UserService.updateUserIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status is updated successfully",
    data: result,
  });
});

// get all users controller
const getAllUsers = catchAsync(async (req, res) => {
  const { data, meta } = await UserService.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users are retrieved successfully",
    data,
    meta,
  });
});

// delete user controller (soft delete)
const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserService.deleteUserFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is deleted successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  getMe,
  updateUser,
  getAllUsers,
  deleteUser,
};
