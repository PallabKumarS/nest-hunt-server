import QueryBuilder from "../../builder/QueryBuilder";
import RequestModel from "./request.model";
import { TRequest } from "./request.interface";
import { generateRequestId } from "../../utils/generateID";
import status from "http-status";

// get all requests from db (admin)
const getAllRequestFromDB = async (query: Record<string, unknown>) => {
  const requestQuery = new QueryBuilder(RequestModel.find({}), query)
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
      .populate("listingId")
      .populate("tenantId")
      .populate("landlordId"),
    query,
  );

  const data = await requestQuery.modelQuery;
  const meta = await requestQuery.countTotal();

  return { data, meta };
};

// get single request from db (admin)
const getSingleRequestFromDB = async (requestId: string) => {
  const result = await RequestModel.findOne({ requestId })
    .populate("listingId")
    .populate("tenantId")
    .populate("landlordId");

  return result;
};

// change request status from db (landlord)
const changeRequestStatusIntoDB = async (requestId: string, status: string) => {
  const result = await RequestModel.findOneAndUpdate(
    { requestId },
    { status },
    {
      new: true,
    },
  );
  return result;
};

// delete request from db (admin)
const deleteRequestFromDB = async (requestId: string) => {
  const result = await RequestModel.findOneAndDelete({ requestId });
  return result;
};

export const RequestService = {
  getAllRequestFromDB,
  getPersonalRequestFromDB,
  getSingleRequestFromDB,
  deleteRequestFromDB,
  createRequestIntoDB,
  changeRequestStatusIntoDB,
};
