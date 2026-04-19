import express from 'express';
import { Enrollment } from '../models/Enrollment';
import { Course } from '../models/Course';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Enroll in a course (Students only)
router.post('/', authenticate, authorizeRoles('STUDENT'), async (req: any, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check capacity
    const activeEnrollments = await Enrollment.countDocuments({ courseId, status: 'ACTIVE' });
    if (activeEnrollments >= (course.capacity as number)) {
        return res.status(400).json({ message: 'Course is full' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ studentId: req.user.id, courseId, status: 'ACTIVE' });
    if (existing) {
        return res.status(400).json({ message: 'Already enrolled' });
    }

    const enrollment = new Enrollment({
      studentId: req.user.id,
      courseId
    });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Drop a course
router.put('/:id/drop', authenticate, authorizeRoles('STUDENT'), async (req: any, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);
        if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

        if (enrollment.studentId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        enrollment.status = 'DROPPED';
        await enrollment.save();
        res.json(enrollment);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user enrollments
router.get('/', authenticate, async (req: any, res) => {
    try {
        let query = {};
        if (req.user.role === 'STUDENT') {
            query = { studentId: req.user.id };
        } else if (req.user.role === 'INSTRUCTOR') {
            const courses = await Course.find({ instructorId: req.user.id });
            query = { courseId: { $in: courses.map(c => c._id) } };
        }
        
        const enrollments = await Enrollment.find(query).populate('courseId').populate('studentId', 'name email');
        res.json(enrollments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
