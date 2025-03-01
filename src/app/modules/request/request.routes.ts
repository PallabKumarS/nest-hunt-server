import { Router } from "express";
import { RequestController } from "./request.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constants";

const router = Router();

router.get("/", auth(USER_ROLE.admin), RequestController.getAllRequest);

router.get(
  "/personal",
  auth(USER_ROLE.tenant, USER_ROLE.landlord),
  RequestController.getPersonalRequest,
);

router.get(
  "/:requestId",
  auth(USER_ROLE.admin),
  RequestController.getSingleRequest,
);

router.post("/", auth(USER_ROLE.tenant), RequestController.createRequest);

router.patch(
  "/:requestId",
  auth(USER_ROLE.landlord),
  RequestController.changeRequestStatus,
);

router.delete(
  "/:requestId",
  auth(USER_ROLE.admin),
  RequestController.deleteRequest,
);

export const RequestRoutes = router;
