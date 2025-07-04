import {
  createEnquiry,
  deleteEnquiryById,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
} from "@src/controllers/enquiries.controller";
import { isAdmin, isAuthenticated } from "@src/middlewares/auth.middleware";

import express from "express";
const router = express.Router();

router.post("/", createEnquiry);
router.patch("/:id", isAdmin, updateEnquiry);
router.get("/", isAdmin, getAllEnquiries);
router.get("/:id", getEnquiryById);
router.delete("/:id", isAdmin, deleteEnquiryById);

export default router;
