import { Document } from "mongoose";

export interface Licensing extends Document {
  fullName: string;
  phone: string;
  email: string | null;
  dateOfBirth: Date | string;
  region: string;
  idMeans: string;
}
