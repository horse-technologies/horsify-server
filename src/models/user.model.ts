import mongoose, { Schema } from "mongoose";
import { Users } from "../interfaces/user.interface";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    otherNames: {
      type: String,
    },
    email: {
      type: String,
    },
    telephone: {
      type: String,
    },
    mobile: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    birth_date: {
      type: Date,
    },
    gender: {
      type: String,
    },
    profile_photo: {
      fileName: { type: String },
      url: { type: String },
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    password: {
      type: String,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ createdAt: -1 });

export default mongoose.model<Users>("users", userSchema);
