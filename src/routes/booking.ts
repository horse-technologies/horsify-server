import {
  createBooking,
  updateBooking,
  deleteBookingById,
  getAllBookings,
  getBookingById,
} from "@src/controllers/booking.controller";
import { isAdmin, isAuthenticated } from "@src/middlewares/auth.middleware";

import express from "express";
const router = express.Router();

router.post("/", createBooking);
router.patch("/:id", isAdmin, updateBooking);
router.get("/", isAdmin, getAllBookings);
router.get("/:id", getBookingById);
router.delete("/:id", isAdmin, deleteBookingById);

export default router;
