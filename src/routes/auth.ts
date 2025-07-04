import {
  forgotPassword,
  genAccessTokenFromRefresh,
  login,
  register,
  resetPassword,
  revokeRefreshToken,
} from "@src/controllers/auth.controller";
import { isAdmin, isAuthenticated } from "@src/middlewares/auth.middleware";

import express from "express";
const router = express.Router();

router.post("/login", login, isAdmin);
router.post("/add-user", isAuthenticated, isAdmin, register);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.post("/refresh-token", genAccessTokenFromRefresh);
router.post("/revoke-refresh-token", revokeRefreshToken);

export default router;
