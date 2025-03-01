import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constants";

const router = Router();

router.get("/users", auth(USER_ROLE.admin), UserController.getAllUsers);

router.post(
  "/users/create-user",
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser,
);

router.get(
  "/users/me",
  auth(USER_ROLE.tenant, USER_ROLE.admin, USER_ROLE.landlord),
  UserController.getMe,
);

router.patch(
  "/users/:userId",
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser,
);

router.delete(
  "/users/:userId",
  auth(USER_ROLE.admin),
  UserController.deleteUser,
);

export const UserRoutes = router;
