import mongoose, { Schema } from "mongoose";
import { Licensing } from "../interfaces/licensing.interface";

const licenseSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String || null,
    },
    dateOfBirth: {
      type: Date || String,
    },
    idMeans: {
      type: String,
    },
    region: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Licensing>("license", licenseSchema);
