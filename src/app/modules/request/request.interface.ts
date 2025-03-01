import { Model, Types } from "mongoose";

export type TRequest = {
  tenantId: Types.ObjectId;
  listingId: Types.ObjectId;
  landlordId: Types.ObjectId;
  requestId?: string;
  status: "pending" | "approved" | "rejected" | "paid";
  message?: string;
};

export interface IRequest extends Model<TRequest> {
  isRequestExists(id: string): Promise<TRequest | null>;
}
