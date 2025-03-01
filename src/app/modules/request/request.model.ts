import { Schema, model, Document } from "mongoose";
import { TRequest } from "./request.interface";

const requestSchema = new Schema<TRequest>(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

requestSchema.statics.isRequestExists = async function (id: string) {
  return await RequestModel.findOne({ id });
};

const RequestModel = model<TRequest>("Requests", requestSchema);

export default RequestModel;