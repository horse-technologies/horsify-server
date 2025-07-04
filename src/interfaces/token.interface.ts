import { Document } from 'mongoose';
import { Users } from './user.interface';

export interface Tokens extends Document {
    jti: string;
    user: Users['_id'];
    token: string;
    revoked: boolean;
}
