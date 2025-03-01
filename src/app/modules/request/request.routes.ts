import { Router } from "express";
import { requestController } from "./request.controller";

const router = Router();

// Define routes
router.get("/", requestController.getAllRequest);

export const RequestRoutes = router;