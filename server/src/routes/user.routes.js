import { Router } from "express";
import {
  getAllFriends,
  getCurrentUser,
  loginUser,
  logoutUser,
  recommededFriends,
  registerUser,
  renewAccessToken,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/friends").get(verifyJWT, getAllFriends);
router.route("/refresh-token").post(renewAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/recommended-friends").get(verifyJWT, recommededFriends);

export default router;
