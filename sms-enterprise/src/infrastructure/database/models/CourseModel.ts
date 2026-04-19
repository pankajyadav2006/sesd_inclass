import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseDocument extends Document {
    code: string;
    title: string;
    description: string;
    credits: number;
    capacity: number;
    instructorId: mongoose.Schema.Types.ObjectId;
    deletedAt?: Date | null;
}

const CourseSchema: Schema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    credits: { type: Number, required: true, default: 3 },
    capacity: { type: Number, required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, default: null }
}, {
    timestamps: true
});

export const CourseModel = mongoose.model<ICourseDocument>('Course', CourseSchema);
