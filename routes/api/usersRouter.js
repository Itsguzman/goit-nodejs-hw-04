import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
} from "../../contactControllers/usersController.js";
import { authenticateToken } from "../../authentication/token.js";

const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get("/current", getCurrentUser);

router.patch("/", authenticateToken, updateUserSubscription);

export { router };
