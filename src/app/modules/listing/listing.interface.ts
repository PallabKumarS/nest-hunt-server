import { Model, Types } from 'mongoose';

export type TListing = {
  houseLocation: string;
  description: string;
  rentPrice: number;
  bedroomNumber: number;
  images: string[];
  landlordId: Types.ObjectId;
  isAvailable?: boolean;
  listingId?: string;
  features?: string;
  isDeleted?: boolean;
};

export interface IListing extends Model<TListing> {
  isListingExists(id: string): Promise<TListing | null>;
}
