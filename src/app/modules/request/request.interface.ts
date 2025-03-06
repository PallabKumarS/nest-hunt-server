import { Model } from 'mongoose';

export type TRequest = {
  tenantId: string;
  listingId: string;
  landlordId: string;
  requestId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  message?: string;
  moveInDate: Date;
  rentDuration: string;
  landlordPhoneNumber?: string;
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
