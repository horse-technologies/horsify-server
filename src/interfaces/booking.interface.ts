import { Document } from "mongoose";
export interface Booking extends Document {
  orderdedBy: string;
  matchedRiders: Array<string>;
  riderId: string;
  pickUp: string;
  destination: string;
  price: number;
  status: string;
}
