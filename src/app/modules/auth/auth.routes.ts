import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constants";

const router = Router();

router.post(
  "/auth/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.patch(
  "/auth/change-password",
  auth(USER_ROLE.admin, USER_ROLE.landlord, USER_ROLE.tenant),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);

router.post(
  "/auth/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

export const AuthRoutes = router;
