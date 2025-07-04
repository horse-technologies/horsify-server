import { Tokens } from '@src/interfaces/token.interface';
import mongoose, { Schema } from 'mongoose';

const tokenSchema = new Schema(
    {
        jti: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'users'
        },
        token: {
                type: String
        },
        revoked: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

tokenSchema.index({ createdAt: -1 });
export default mongoose.model<Tokens>('tokens', tokenSchema);
