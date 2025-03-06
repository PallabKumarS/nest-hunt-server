import QueryBuilder from '../../builder/QueryBuilder';
import RequestModel from './request.model';
import { TRequest } from './request.interface';
import { generateRequestId } from '../../utils/generateID';
import { makePaymentAsync, verifyPaymentAsync } from './request.utils';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ListingModel from '../listing/listing.model';

interface PopulatedListing {
  rentPrice: number;
  houseLocation: string;
}

interface PopulatedTenant {
  name: string;
  address: string;
  email: string;
  phone: string;
}

interface PopulatedLandlord {
  userId: string;
}

type PopulatedRequest = {
  listingId: PopulatedListing;
  tenantId: PopulatedTenant;
  landlordId: PopulatedLandlord;
  requestId: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  message?: string;
  moveInDate: Date;
  rentDuration: string;
  transaction?: Record<string, any>;
};
// get all requests from db (admin)
const getAllRequestFromDB = async (query: Record<string, unknown>) => {
  const requestQuery = new QueryBuilder(
    RequestModel.find({})
      .populate({
        path: 'listingId',
        localField: 'listingId',
        foreignField: 'listingId',
      })
      .populate({
        path: 'tenantId',
        localField: 'tenantId',
        foreignField: 'userId',
      })
      .populate({
        path: 'landlordId',
        localField: 'landlordId',
        foreignField: 'userId',
      }),
    query,
  )
    .filter()
    .sort()
    .paginate();

  const data = await requestQuery.modelQuery;
  const meta = await requestQuery.countTotal();

  return { data, meta };
};

// create request in the db (tenant)
const createRequestIntoDB = async (payload: TRequest) => {
  payload.requestId = await generateRequestId();

  const isRequestExists = await RequestModel.findOne({
    listingId: payload.listingId,
    tenantId: payload.tenantId,
  });

  if (isRequestExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already applied for this listing',
    );
  }

  const result = await RequestModel.create(payload);
  return result;
};

// get personal requests from db (tenant & landlord)
const getPersonalRequestFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const requestQuery = new QueryBuilder(
    RequestModel.find({
      $or: [{ tenantId: userId }, { landlordId: userId }],
    })
      .populate({
        path: 'listingId',
        localField: 'listingId',
        foreignField: 'listingId',
      })
      .populate({
        path: 'tenantId',
        localField: 'tenantId',
        foreignField: 'userId',
      })
      .populate({
        path: 'landlordId',
        localField: 'landlordId',
        foreignField: 'userId',
      }),
    query,
  );

  const data = await requestQuery.modelQuery;
  const meta = await requestQuery.countTotal();

  return { data, meta };
};

// get single request from db (admin)
const getSingleRequestFromDB = async (requestId: string) => {
  const result = await RequestModel.findOne({ requestId })
    .populate({
      path: 'listingId',
      localField: 'listingId',
      foreignField: 'listingId',
    })
    .populate({
      path: 'tenantId',
      localField: 'tenantId',
      foreignField: 'userId',
    })
    .populate({
      path: 'landlordId',
      localField: 'landlordId',
      foreignField: 'userId',
    });

  return result;
};

// change request status from db (landlord)
const changeRequestStatusIntoDB = async (
  requestId: string,
  status: { status: string },
) => {
  const isRequestExists = await RequestModel.findOne({ requestId });

  if (!isRequestExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Request not found');
  }

  if (isRequestExists.status === 'paid') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request already paid');
  }

  const result = await RequestModel.findOneAndUpdate(
    { requestId },
    { status: status.status },
    {
      new: true,
    },
  );

  return result;
};

// delete request from db (admin)
const deleteRequestFromDB = async (requestId: string) => {
  const isRequestExists = await RequestModel.findOne({ requestId });

  if (!isRequestExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Request not found');
  }

  if (isRequestExists.status === 'paid') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request already paid');
  }

  const result = await RequestModel.findOneAndDelete({ requestId });
  return result;
};

// create payment in the db (tenant)
const createPaymentIntoDB = async (requestId: string, client_ip: string) => {
  try {
    const requestData = (await RequestModel.findOne({ requestId })
      .populate({
        path: 'listingId',
        localField: 'listingId',
        foreignField: 'listingId',
      })
      .populate({
        path: 'tenantId',
        localField: 'tenantId',
        foreignField: 'userId',
      })
      .populate({
        path: 'landlordId',
        localField: 'landlordId',
        foreignField: 'userId',
      })
      .lean()
      .exec()) as unknown as PopulatedRequest;

    const shurjopayPayload = {
      amount: requestData?.listingId.rentPrice,
      order_id: requestId,
      currency: 'BDT',
      customer_name: requestData?.tenantId.name,
      customer_address: requestData?.tenantId?.address || 'N/A',
      customer_email: requestData?.tenantId.email,
      customer_phone: requestData?.tenantId?.phone || 'N/A',
      customer_city: requestData?.listingId.houseLocation || 'N/A',
      client_ip,
    };

    const payment = await makePaymentAsync(shurjopayPayload);

    console.log(payment);

    let updatedRequest: TRequest | null = null;

    if (payment?.transactionStatus) {
      updatedRequest = await RequestModel.findOneAndUpdate(
        { requestId },
        {
          $set: {
            transaction: {
              paymentId: payment.sp_order_id,
              transactionStatus: payment.transactionStatus,
              paymentUrl: payment.checkout_url,
            },
          },
        },
        { new: true },
      );
    }

    if (!updatedRequest) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update order');
    }

    return updatedRequest;
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create payment');
  }
};

// verify payment from db (tenant)
const verifyPaymentFromDB = async (paymentId: string) => {
  const payment = await verifyPaymentAsync(paymentId);

  if (payment.length) {
    await RequestModel.findOneAndUpdate(
      {
        'transaction.paymentId': paymentId,
      },
      {
        'transaction.bankStatus': payment[0].bank_status,
        'transaction.spCode': payment[0].sp_code,
        'transaction.spMessage': payment[0].sp_message,
        'transaction.method': payment[0].method,
        'transaction.dateTime': payment[0].date_time,
        'transaction.transactionStatus': payment[0].transaction_status,
        status:
          payment[0].bank_status == 'Success'
            ? 'paid'
            : payment[0].bank_status == 'Failed'
              ? 'pending'
              : payment[0].bank_status == 'Cancel'
                ? 'cancelled'
                : 'pending',
      },
    );
  }

  // if the payment is successful, update the bike quantity
  if (payment[0].bank_status === 'Success') {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // check if order was placed before
      const requestExists = await RequestModel.findOne({
        'transaction.paymentId': paymentId,
      });

      if (!requestExists) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'Payment was not done correctly, please try again',
        );
      }

      // update  (first transaction)
      const updatedRequest = await RequestModel.findOneAndUpdate(
        { requestId: requestExists?.requestId },
        { status: 'paid' },
        { new: true, session },
      );

      if (!updatedRequest) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update request');
      }

      // update order (second transaction)
      const updatedListing = await ListingModel.findOneAndUpdate(
        { listingId: requestExists?.listingId },
        {
          isAvailable: false,
        },
      );

      if (!updatedListing) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update listing');
      }

      await session.commitTransaction();
      await session.endSession();
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }
  }

  return payment[0];
};

export const RequestService = {
  getAllRequestFromDB,
  getPersonalRequestFromDB,
  getSingleRequestFromDB,
  deleteRequestFromDB,
  createRequestIntoDB,
  changeRequestStatusIntoDB,
  createPaymentIntoDB,
  verifyPaymentFromDB,
};
