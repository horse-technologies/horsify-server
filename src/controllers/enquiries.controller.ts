import { NextFunction, Response } from "express";
import Enquiries from "../models/enquiries.model";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { validateCreateEnquiry } from "@src/validations/enquiry.validation";
import { generateActivityEmail, sendEmail } from "@src/util/sendEmail.util";

const createEnquiry = async (req: any, res: Response) => {
  try {
    const data = await validateCreateEnquiry.validateAsync(req.body);
    const existingEnquiries = await Enquiries.find();
    const filterEnquiries = existingEnquiries.filter(
      (_enquiry) => _enquiry.phone === req.body.phone
    );

    if (filterEnquiries?.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error:
          "You have already joined our waitlist. We are excited to know you can't wait; We will be launching shortly.",
      });
    } else {
      const enquiry = new Enquiries(data);
      await enquiry.save();
      const text = await generateActivityEmail(data.fullName);
      // await sendEmail(data?.email, "Enquiries Received", text);
      return res.json(enquiry);
    }
  } catch (error) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: error.message });
  }
};

const updateEnquiry = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const data = await validateCreateEnquiry.validateAsync(req.body);

    const enquiry = await Enquiries.findByIdAndUpdate(
      id,
      { $set: { ...data } },
      { new: true }
    );
    await enquiry?.save();
    if (enquiry === null)
      return res.status(400).json({ error: "Enquiries details not updated" });
    await enquiry.save();
    res.json(enquiry);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteEnquiryById = async (req: any, res: Response) => {
  try {
    const enquiry = await Enquiries.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: "Enquiries not found" });
    await enquiry.deleteOne();

    res.status(HttpStatusCodes.NO_CONTENT).json(enquiry);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllEnquiries = async (req: any, res: Response) => {
  try {
    const enquiries = await Enquiries.find();
    res.json(enquiries);
  } catch (error) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: error.message });
  }
};

const getEnquiryById = async (req: any, res: Response) => {
  try {
    const enquiry = await Enquiries.findById(req.params.id);
    if (!enquiry) return res.status(400).json({ error: "Enquiry not found" });
    res.json(enquiry);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export {
  createEnquiry,
  updateEnquiry,
  deleteEnquiryById,
  getAllEnquiries,
  getEnquiryById,
};
