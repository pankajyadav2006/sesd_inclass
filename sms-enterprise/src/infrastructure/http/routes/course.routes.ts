import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { CourseService } from '../../../application/services/CourseService';
import { CourseRepository } from '../../database/repositories/CourseRepository';
import { authenticateJwt, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../../../domain/entities/User';

const router = Router();

// DI Setup
const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const courseController = new CourseController(courseService);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses with pagination and search
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/', courseController.list);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 */
router.get('/:id', courseController.getById);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, title, description, credits, capacity]
 *             properties:
 *               code: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *               credits: { type: number }
 *               capacity: { type: number }
 *     responses:
 *       201:
 *         description: Course created
 */
router.post('/', authenticateJwt, requireRole([UserRole.INSTRUCTOR, UserRole.ADMIN]), courseController.create);

router.put('/:id', authenticateJwt, requireRole([UserRole.INSTRUCTOR, UserRole.ADMIN]), courseController.update);
router.delete('/:id', authenticateJwt, requireRole([UserRole.INSTRUCTOR, UserRole.ADMIN]), courseController.delete);

export default router;
