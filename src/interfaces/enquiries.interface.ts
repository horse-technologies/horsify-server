import { Document } from "mongoose";
export interface Enquiries extends Document {
  fullName: string;
  phone: string;
  email: string;
  contactChoice: string;
  role: string;
  message: string | any;
}
