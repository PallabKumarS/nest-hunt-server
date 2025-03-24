import { Router } from 'express';
import { ListingController } from './listing.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.get('/', ListingController.getAllListings);

router.get('/locations', ListingController.getListingLocations);

router.get('/:listingId', ListingController.getSingleListing);

router.get(
  '/personal',
  auth(USER_ROLE.landlord),
  ListingController.getPersonalListings,
);

router.post('/', auth(USER_ROLE.landlord), ListingController.createListing);

router.patch(
  '/:listingId',
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  ListingController.updateListing,
);

router.patch(
  '/status/:listingId',
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  ListingController.updateListingStatus,
);

router.delete(
  '/:listingId',
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  ListingController.deleteListing,
);

export const ListingRoutes = router;
