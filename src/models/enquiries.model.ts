import mongoose, { Schema } from "mongoose";
import { Enquiries } from "../interfaces/enquiries.interface";

const enquiriesSchema = new Schema(
  {
    fullName: {
      type: String,
    },

    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    contactChoice: {
      type: String,
    },
    role: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Enquiries>("enquiries", enquiriesSchema);
