import { Document } from "mongoose";
export interface Users extends Document {
  firstName: string;
  lastName: string;
  otherNames: string;
  email: string;
  country: string;
  telephone: string;
  mobile: string;
  password: string;
  birth_date: string;
  gender: string;
  profile_photo: { fileName: string; url: string; caption: string };
  isDeleted: boolean;
  role: string;
}
