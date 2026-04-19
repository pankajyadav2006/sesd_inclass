import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../../domain/entities/User';

export interface IUserDocument extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.STUDENT },
    isVerified: { type: Boolean, default: false }
}, {
    timestamps: true
});

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
