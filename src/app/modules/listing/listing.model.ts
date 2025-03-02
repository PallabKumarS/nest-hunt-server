import { Schema, model, Document } from 'mongoose';
import { IListing, TListing } from './listing.interface';

const listingsSchema = new Schema<TListing, IListing>(
  {
    houseLocation: { type: String, required: true },
    description: { type: String, required: true },
    rentPrice: { type: Number, required: true },
    bedroomNumber: { type: Number, required: true },
    images: { type: [String], required: true },
    landlordId: { type: String, ref: 'User' },
    isAvailable: { type: Boolean, default: false },
    listingId: { type: String },
    features: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

listingsSchema.statics.isListingsExists = async function (id: string) {
  return await ListingModel.findOne({ id });
};

const ListingModel = model<TListing, IListing>('Listing', listingsSchema);

export default ListingModel;
