import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../errors/AppError';
import { generateListingId } from '../../utils/generateID';
import { listingSearchableFields } from './listing.constant';
import { TListing } from './listing.interface';
import ListingModel from './listing.model';
import httpStatus from 'http-status';

// get all listings from db
const getAllListingsFromDB = async (query: Record<string, unknown>) => {
  const listingQuery = new QueryBuilder(
    ListingModel.find({
      isDeleted: {
        $ne: true,
      },
    }),
    query,
  )
    .search(listingSearchableFields)
    .filter()
    .sort()
    .paginate();

  const data = await listingQuery.modelQuery;
  const meta = await listingQuery.countTotal();

  return { data, meta };
};

// create listings in the db
const createListingIntoDB = async (payload: TListing) => {
  payload.listingId = await generateListingId();

  const result = await ListingModel.create(payload);
  return result;
};

// get single listing from db
const getSingleListingFromDB = async (listingId: string) => {
  const isExists = await ListingModel.isListingExists(listingId);

  if (!isExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Listing not found');
  }

  const result = await ListingModel.findOne({ listingId });
  return result;
};

// get personal listings from db (landlord)
const getPersonalListingsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const listingQuery = new QueryBuilder(
    ListingModel.find({
      landlordId: userId,
      isDeleted: false,
    }),
    query,
  )
    .filter()
    .sort()
    .paginate();

  const data = await listingQuery.modelQuery;
  const meta = await listingQuery.countTotal();

  return { data, meta };
};

// update status of listing in the db
const updateListingStatusIntoDB = async (listingId: string) => {
  const isListing = await ListingModel.isListingExists(listingId);
  if (!isListing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Listing not found');
  }
  const result = await ListingModel.findOneAndUpdate(
    { listingId },
    { isAvailable: false },
    {
      new: true,
    },
  );
  return result;
};

const updateListingIntoDB = async (
  listingId: string,
  payload: Partial<TListing>,
) => {
  const isListing = await ListingModel.isListingExists(listingId);
  if (!isListing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Listing not found');
  }
  const result = await ListingModel.findOneAndUpdate({ listingId }, payload, {
    new: true,
  });
  return result;
};

const deleteListingFromDB = async (listingId: string) => {
  const isListing = await ListingModel.isListingExists(listingId);
  if (!isListing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Listing not found');
  }
  const result = await ListingModel.findOneAndUpdate(
    { listingId },
    { isDeleted: true },
    {
      new: true,
    },
  );
  return result;
};

export const ListingService = {
  getAllListingsFromDB,
  createListingIntoDB,
  getSingleListingFromDB,
  getPersonalListingsFromDB,
  updateListingStatusIntoDB,
  updateListingIntoDB,
  deleteListingFromDB,
};
