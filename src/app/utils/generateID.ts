import ListingModel from '../modules/listing/listing.model';
import RequestModel from '../modules/request/request.model';
import UserModel from '../modules/user/user.model';

// user id
export const generateUserId = async (userRole: string) => {
  const findLastUserId = async () => {
    const lastUser = await UserModel.findOne(
      { role: userRole },
      { userId: 1, _id: 0 },
    )
      .sort({ createdAt: -1 })
      .lean();
    return lastUser?.userId ? lastUser.userId : undefined;
  };

  let currentId = '0';
  const lastUserId = await findLastUserId();

  if (lastUserId) {
    currentId = lastUserId.split('-')[1];
  }

  let incrementId = '';

  if (userRole === 'admin') {
    incrementId = `A-${(Number(currentId) + 1).toString().padStart(5, '0')}`;
  } else if (userRole === 'landlord') {
    incrementId = `L-${(Number(currentId) + 1).toString().padStart(5, '0')}`;
  } else if (userRole === 'tenant') {
    incrementId = `T-${(Number(currentId) + 1).toString().padStart(5, '0')}`;
  }

  return incrementId;
};

// listing id
export const generateListingId = async () => {
  const findLasListingId = async () => {
    const lastListing = await ListingModel.findOne({}, { listingId: 1, _id: 0 })
      .sort({ createdAt: -1 })
      .lean();
    return lastListing?.listingId ? lastListing.listingId : undefined;
  };

  let currentId = '0';
  const lastListingId = await findLasListingId();

  if (lastListingId) {
    currentId = lastListingId.split('-')[1];
  }

  let incrementId = `L-${(Number(currentId) + 1).toString().padStart(5, '0')}`;

  return incrementId;
};

// request id
export const generateRequestId = async () => {
  const findLasRequestId = async () => {
    const lastRequest = await RequestModel.findOne({}, { requestId: 1, _id: 0 })
      .sort({ createdAt: -1 })
      .lean();
    return lastRequest?.requestId ? lastRequest.requestId : undefined;
  };

  let currentId = '0';
  const lastRequestId = await findLasRequestId();

  if (lastRequestId) {
    currentId = lastRequestId.split('-')[1];
  }

  let incrementId = `R-${(Number(currentId) + 1).toString().padStart(5, '0')}`;

  return incrementId;
};
