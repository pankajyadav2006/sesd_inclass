import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['ACTIVE', 'DROPPED'], default: 'ACTIVE' }
}, { timestamps: true });

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
