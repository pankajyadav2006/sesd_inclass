import { Request, Response } from 'express';
import { EnrollmentService } from '../../../application/services/EnrollmentService';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { logger } from '../../logger';
import { z } from 'zod';

const idSchema = z.object({ courseId: z.string() });

export class EnrollmentController {
    constructor(private enrollmentService: EnrollmentService) {}

    enroll = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const { courseId } = idSchema.parse(req.body);
            const result = await this.enrollmentService.enrollStudent(req.user!.id, courseId);
            res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    drop = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const { courseId } = idSchema.parse(req.body);
            await this.enrollmentService.dropCourse(req.user!.id, courseId);
            res.status(200).json({ success: true, message: 'Successfully dropped course' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    list = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const result = await this.enrollmentService.getMyEnrollments(req.user!.id);
            res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
