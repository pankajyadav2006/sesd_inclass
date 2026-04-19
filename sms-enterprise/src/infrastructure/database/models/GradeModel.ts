import mongoose, { Schema, Document } from 'mongoose';

export interface IGradeDocument extends Document {
    studentId: mongoose.Schema.Types.ObjectId;
    courseId: mongoose.Schema.Types.ObjectId;
    instructorId: mongoose.Schema.Types.ObjectId;
    score: number;
    letterGrade: string;
    comments?: string;
    awardedAt: Date;
}

const GradeSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    letterGrade: { type: String, required: true },
    comments: { type: String },
    awardedAt: { type: Date, default: Date.now }
});

export const GradeModel = mongoose.model<IGradeDocument>('Grade', GradeSchema);
