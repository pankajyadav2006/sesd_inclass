import mongoose, { Schema, Document } from 'mongoose';
import { EnrollmentStatus } from '../../../domain/entities/Enrollment';

export interface IEnrollmentDocument extends Document {
    studentId: mongoose.Schema.Types.ObjectId;
    courseId: mongoose.Schema.Types.ObjectId;
    status: EnrollmentStatus;
    enrolledAt: Date;
    droppedAt?: Date | null;
}

const EnrollmentSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: Object.values(EnrollmentStatus), default: EnrollmentStatus.ACTIVE },
    enrolledAt: { type: Date, default: Date.now },
    droppedAt: { type: Date, default: null }
});

// A student can only have one active/completed enrollment per course
EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true, partialFilterExpression: { status: { $ne: EnrollmentStatus.DROPPED } } });

export const EnrollmentModel = mongoose.model<IEnrollmentDocument>('Enrollment', EnrollmentSchema);
