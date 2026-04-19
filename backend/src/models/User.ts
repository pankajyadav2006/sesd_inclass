import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'INSTRUCTOR', 'ADMIN'], default: 'STUDENT' },
  major: { type: String }, // For students
  department: { type: String } // For instructors
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
