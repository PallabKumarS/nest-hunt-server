import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RequestService } from './request.service';
import httpStatus from 'http-status';
import { request } from 'http';

// get all requests controller (admin)
const getAllRequest = catchAsync(async (req: Request, res: Response) => {
  const data = await RequestService.getAllRequestFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request retrieved successfully',
    data,
  });
});

// create request controller (tenant)
const createRequest = catchAsync(async (req: Request, res: Response) => {
  const data = await RequestService.createRequestIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Request created successfully',
    data,
  });
});

// get personal requests controller (tenant & landlord)
const getPersonalRequest = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await RequestService.getPersonalRequestFromDB(
    req.user?.userId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request retrieved successfully',
    data,
    meta,
  });
});

// get single request controller (admin)
const getSingleRequest = catchAsync(async (req: Request, res: Response) => {
  const data = await RequestService.getSingleRequestFromDB(
    req.params.requestId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request retrieved successfully',
    data,
  });
});

// change status of request controller (landlord)
const changeRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const data = await RequestService.changeRequestStatusIntoDB(
    req.params.requestId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request status changed successfully',
    data,
  });
});

// update request controller
const updateRequest = catchAsync(async (req: Request, res: Response) => {
  const data = await RequestService.updateRequestIntoDB(
    req.params.requestId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request updated successfully',
    data,
  });
});

// delete requests controller (admin)
const deleteRequest = catchAsync(async (req: Request, res: Response) => {
  const data = await RequestService.deleteRequestFromDB(req.params.requestId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request deleted successfully',
    data,
  });
});

// payment controller (tenant)
const createPayment = catchAsync(async (req: Request, res: Response) => {
  const requestId = req.params.requestId;

  const data = await RequestService.createPaymentIntoDB(requestId, req.ip!);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment process started',
    data,
  });
});

// verify payment and update request status controller (tenant)
const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const paymentId = req.params.paymentId;

  const result = await RequestService.verifyPaymentFromDB(paymentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment verified successfully',
    data: result,
  });
});

export const RequestController = {
  getAllRequest,
  createRequest,
  getPersonalRequest,
  getSingleRequest,
  deleteRequest,
  changeRequestStatus,
  createPayment,
  verifyPayment,
  updateRequest,
};
