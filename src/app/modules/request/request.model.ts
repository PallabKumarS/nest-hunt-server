import { Schema, model, Document } from 'mongoose';
import { IRequest, TRequest } from './request.interface';

const requestSchema = new Schema<TRequest, IRequest>(
  {
    message: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paid', 'cancelled'],
      default: 'pending',
    },
    moveInDate: { type: Date, required: true },
    rentDuration: { type: String, required: true },
    tenantId: { type: String, ref: 'User' },
    listingId: { type: String, ref: 'Listing' },
    landlordId: { type: String, ref: 'User' },
    requestId: { type: String, unique: true },
    landlordPhoneNumber: { type: String },
    transaction: {
      paymentId: { type: String },
      transactionStatus: { type: String },
      paymentUrl: { type: String },
      bankStatus: { type: String },
      spCode: { type: String },
      spMessage: { type: String },
      method: { type: String },
      dateTime: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

requestSchema.statics.isRequestExists = async function (id: string) {
  return await RequestModel.findOne({ id });
};

const RequestModel = model<TRequest, IRequest>('Request', requestSchema);

export default RequestModel;
