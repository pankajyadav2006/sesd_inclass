import mongoose, { Schema, Document } from 'mongoose';
import { WaitlistStatus } from '../../../domain/entities/Waitlist';

export interface IWaitlistDocument extends Document {
    studentId: mongoose.Schema.Types.ObjectId;
    courseId: mongoose.Schema.Types.ObjectId;
    position: number;
    status: WaitlistStatus;
    joinedAt: Date;
}

const WaitlistSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    position: { type: Number, required: true },
    status: { type: String, enum: Object.values(WaitlistStatus), default: WaitlistStatus.PENDING },
    joinedAt: { type: Date, default: Date.now }
});

WaitlistSchema.index({ studentId: 1, courseId: 1, status: 1 }, { unique: true });

export const WaitlistModel = mongoose.model<IWaitlistDocument>('Waitlist', WaitlistSchema);
