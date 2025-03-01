import { Router } from "express";
import { ListingController } from "./listing.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constants";

const router = Router();

router.get("/", ListingController.getAllListings);

router.post("/", auth(USER_ROLE.landlord), ListingController.createListing);

router.get(
  "/personal",
  auth(USER_ROLE.landlord),
  ListingController.getPersonalListings,
);

router.get(
  "/:listingId",
  auth(USER_ROLE.landlord, USER_ROLE.tenant, USER_ROLE.admin),
  ListingController.getSingleListing,
);

router.patch(
  "/:listingId",
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  ListingController.updateListing,
);

router.patch(
  "/status/:listingId",
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  ListingController.updateListingStatus,
);

router.delete(
  "/:listingId",
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  ListingController.deleteListing,
);

export const ListingRoutes = router;
