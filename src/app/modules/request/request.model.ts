import { Schema, model, Document } from "mongoose";
import { IRequest, TRequest } from "./request.interface";

const requestSchema = new Schema<TRequest, IRequest>(
  {
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },
    tenantId: { type: Schema.Types.ObjectId, ref: "User" },
    listingId: { type: Schema.Types.ObjectId, ref: "Listing" },
    landlordId: { type: Schema.Types.ObjectId, ref: "User" },
    requestId: { type: String, unique: true },
  },
  {
    timestamps: true,
  },
);

requestSchema.statics.isRequestExists = async function (id: string) {
  return await RequestModel.findOne({ id });
};

const RequestModel = model<TRequest, IRequest>("Request", requestSchema);

export default RequestModel;
