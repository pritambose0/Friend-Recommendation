import { Router } from "express";
import {
  getFriendRequests,
  getSentRequests,
  handleFriendRequest,
  sendFriendRequest,
} from "../controllers/friendRequest.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/send/:receiverId").post(sendFriendRequest);
router.route("/handle/:receiverId/:senderId").post(handleFriendRequest);
router.route("/received").get(getFriendRequests);
router.route("/sent").get(getSentRequests);

export default router;
