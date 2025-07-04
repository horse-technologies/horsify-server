import {
  deleteLicenseRequestFxn,
  getAllLicenseRequestsFxn,
  getSpecificLicenseRequestsFxn,
  requestLicenseFxn,
  updateLicenseRequestFxn,
} from "@src/controllers/license.controller";
import { isAdmin } from "@src/middlewares/auth.middleware";

import express from "express";
const router = express.Router();

router.post("/", requestLicenseFxn);
router.patch("/:id", isAdmin, updateLicenseRequestFxn);
router.get("/", isAdmin, getAllLicenseRequestsFxn);
router.get("/:id", getSpecificLicenseRequestsFxn);
router.delete("/:id", isAdmin, deleteLicenseRequestFxn);

export default router;
