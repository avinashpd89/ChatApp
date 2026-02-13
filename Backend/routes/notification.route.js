
import express from "express";
import { subscribeToPush } from "../controller/notification.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.post("/subscribe", secureRoute, subscribeToPush);

export default router;
