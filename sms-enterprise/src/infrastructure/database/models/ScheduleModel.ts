import mongoose, { Schema, Document } from 'mongoose';
import { DayOfWeek } from '../../../domain/entities/Schedule';

export interface IScheduleDocument extends Document {
    courseId: mongoose.Schema.Types.ObjectId;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    room: string;
}

const ScheduleSchema = new Schema({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    dayOfWeek: { type: String, enum: Object.values(DayOfWeek), required: true },
    startTime: { type: String, required: true }, // Format HH:mm
    endTime: { type: String, required: true },
    room: { type: String, required: true }
});

export const ScheduleModel = mongoose.model<IScheduleDocument>('Schedule', ScheduleSchema);
