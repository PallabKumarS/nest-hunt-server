import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

// Define routes
router.get("/", UserController.getAllUser);

export const UserRoutes = router;
