import { Model } from "mongoose";

export type TRequest = {
  name: string;
  requestId?: string;
};

export interface IRequest extends Model<TRequest> {
  isRequestExists(id: string): Promise<TRequest | null>;
}
