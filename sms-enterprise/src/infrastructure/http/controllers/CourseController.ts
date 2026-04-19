import { Request, Response } from 'express';
import { CourseService } from '../../../application/services/CourseService';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { z } from 'zod';
import { logger } from '../../logger';

const courseSchema = z.object({
    code: z.string().min(2),
    title: z.string().min(3),
    description: z.string(),
    credits: z.number().int().positive(),
    capacity: z.number().int().positive()
});

export class CourseController {
    constructor(private courseService: CourseService) {}

    create = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const data = courseSchema.parse(req.body);
            const course = await this.courseService.createCourse(data, req.user!.id);
            res.status(201).json({ success: true, data: course });
        } catch (error: any) {
            logger.error(`Course creation error: ${error.message}`);
            res.status(400).json({ success: false, message: error.message });
        }
    };

    list = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;

            const result = await this.courseService.getCourses(page, limit, search);
            res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const course = await this.courseService.getCourseById(req.params.id);
            res.status(200).json({ success: true, data: course });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message });
        }
    };

    update = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const course = await this.courseService.updateCourse(req.params.id, req.body, req.user!.id, req.user!.role);
            res.status(200).json({ success: true, data: course });
        } catch (error: any) {
            res.status(403).json({ success: false, message: error.message });
        }
    };

    delete = async (req: AuthenticatedRequest, res: Response) => {
        try {
            await this.courseService.deleteCourse(req.params.id, req.user!.id, req.user!.role);
            res.status(200).json({ success: true, message: 'Course deleted successfully' });
        } catch (error: any) {
            res.status(403).json({ success: false, message: error.message });
        }
    };
}
