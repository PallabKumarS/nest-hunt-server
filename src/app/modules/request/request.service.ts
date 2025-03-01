import RequestModel from "./request.model";

const getAllRequestFromDB = async () => {
  const result = await RequestModel.find({});
  return result;
};

export const RequestService = { getAllRequestFromDB };