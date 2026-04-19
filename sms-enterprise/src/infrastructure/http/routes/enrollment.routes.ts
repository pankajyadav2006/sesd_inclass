import { Router } from 'express';
import { EnrollmentController } from '../controllers/EnrollmentController';
import { EnrollmentService } from '../../../application/services/EnrollmentService';
import { EnrollmentRepository } from '../../database/repositories/EnrollmentRepository';
import { WaitlistRepository } from '../../database/repositories/WaitlistRepository';
import { CourseRepository } from '../../database/repositories/CourseRepository';
import { authenticateJwt, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../../../domain/entities/User';

const router = Router();

const enrollmentRepo = new EnrollmentRepository();
const waitlistRepo = new WaitlistRepository();
const courseRepo = new CourseRepository();
const enrollmentService = new EnrollmentService(enrollmentRepo, waitlistRepo, courseRepo);
const enrollmentController = new EnrollmentController(enrollmentService);

/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: List my enrollments
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticateJwt, requireRole([UserRole.STUDENT]), enrollmentController.list);

/**
 * @swagger
 * /enrollments/enroll:
 *   post:
 *     summary: Enroll in a course (auto waitlists if full)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId: { type: string }
 */
router.post('/enroll', authenticateJwt, requireRole([UserRole.STUDENT]), enrollmentController.enroll);

/**
 * @swagger
 * /enrollments/drop:
 *   post:
 *     summary: Drop a course (triggers waitlist promotion)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId: { type: string }
 */
router.post('/drop', authenticateJwt, requireRole([UserRole.STUDENT]), enrollmentController.drop);

export default router;
