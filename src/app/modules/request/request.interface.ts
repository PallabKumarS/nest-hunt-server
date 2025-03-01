import { Model, Types } from 'mongoose';

export type TRequest = {
  tenantId: Types.ObjectId;
  listingId: Types.ObjectId;
  landlordId: Types.ObjectId;
  requestId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  message?: string;
  transaction?: {
    paymentId?: string;
    transactionStatus?: string;
    paymentUrl?: string;
    bankStatus?: string;
    spCode?: string;
    spMessage?: string;
    method?: string;
    dateTime?: string;
  };
};

export interface IRequest extends Model<TRequest> {
  isRequestExists(id: string): Promise<TRequest | null>;
}
