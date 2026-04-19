import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  capacity: { type: Number, required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Course = mongoose.model('Course', courseSchema);
