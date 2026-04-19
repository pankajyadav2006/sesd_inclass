import express from 'express';
import { Course } from '../models/Course';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Get all courses (anyone)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructorId', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a course (Instructors only)
router.post('/', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), async (req: any, res) => {
  try {
    const { code, title, capacity } = req.body;
    const course = new Course({
      code,
      title,
      capacity,
      instructorId: req.user.id
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a course
router.put('/:id', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), async (req: any, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    
    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a course
router.delete('/:id', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), async (req: any, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
