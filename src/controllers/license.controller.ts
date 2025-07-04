import { NextFunction, Response } from "express";
import Licensing from "../models/license.model";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { generateActivityEmail, sendEmail } from "@src/util/sendEmail.util";
import { validateLicenseRequest } from "@src/validations/licensing.validation";

const requestLicenseFxn = async (req: any, res: Response) => {
  try {
    const data = await validateLicenseRequest.validateAsync(req.body);

    const existingLicenseRequests = await Licensing.find();

    const filterExistingRequest = existingLicenseRequests.filter(
      (_request) => _request.phone === req.body.phone
    );

    if (filterExistingRequest?.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error:
          "You have already registered for this service. Hang tight, the team will be in touch.",
      });
    } else {
      const license = new Licensing(data);
      await license.save();
      return res.json(license);
    }

    const text = await generateActivityEmail(data.fullName);
    // await sendEmail(data?.email, "Licensing Received", text);
  } catch (error) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: error.message });
  }
};

const updateLicenseRequestFxn = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const data = await validateLicenseRequest.validateAsync(req.body);

    const license = await Licensing.findByIdAndUpdate(
      id,
      { $set: { ...data } },
      { new: true }
    );
    await license?.save();
    if (license === null)
      return res.status(400).json({ error: "Licensing details not updated" });
    await license.save();
    res.json(license);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteLicenseRequestFxn = async (req: any, res: Response) => {
  try {
    const license = await Licensing.findById(req.params.id);
    if (!license) return res.status(404).json({ error: "Licensing not found" });
    await license.deleteOne();

    res.status(HttpStatusCodes.NO_CONTENT).json(license);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllLicenseRequestsFxn = async (req: any, res: Response) => {
  try {
    const enquiries = await Licensing.find();
    res.json(enquiries);
  } catch (error) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: error.message });
  }
};

const getSpecificLicenseRequestsFxn = async (req: any, res: Response) => {
  try {
    const license = await Licensing.findById(req.params.id);
    if (!license) return res.status(400).json({ error: "Enquiry not found" });
    res.json(license);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export {
  requestLicenseFxn,
  updateLicenseRequestFxn,
  deleteLicenseRequestFxn,
  getAllLicenseRequestsFxn,
  getSpecificLicenseRequestsFxn,
};
