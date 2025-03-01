import { Request, Response } from "express";
import { requestService } from "./request.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const getAllRequest = catchAsync(async (req: Request, res: Response) => {
  const data = await requestService.getAllRequestFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Request retrieved successfully",
    data,
  });
});

export const RequestController = { getAllRequest };