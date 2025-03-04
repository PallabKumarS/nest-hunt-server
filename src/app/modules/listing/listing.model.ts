import { Schema, model } from 'mongoose';
import { IListing, TListing } from './listing.interface';

const listingSchema = new Schema<TListing, IListing>(
  {
    houseLocation: { type: String, required: true },
    description: { type: String, required: true },
    rentPrice: { type: Number, required: true },
    bedroomNumber: { type: Number, required: true },
    images: { type: [String], required: true },
    landlordId: { type: String, ref: 'User' },
    isAvailable: { type: Boolean, default: true },
    listingId: { type: String, unique: true },
    features: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

listingSchema.statics.isListingExists = async function (listingId: string) {
  return await ListingModel.findOne({ listingId });
};

const ListingModel = model<TListing, IListing>('Listing', listingSchema);

export default ListingModel;
