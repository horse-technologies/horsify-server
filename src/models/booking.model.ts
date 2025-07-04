import mongoose, { Schema } from "mongoose";
import { Booking } from "../interfaces/booking.interface";

const BookingSchema = new Schema(
  {
    orderdedBy: {
      type: String,
    },
    matchedRiders: {
      type: Array<String>,
    },
    riderId: {
      type: String,
    },
    pickUp: {
      type: String,
    },
    destination: {
      type: String,
    },
    price: {
      type: Number,
    },
    status: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Booking>("booking", BookingSchema);
