import { Request, Response } from 'express';
import { AuthService } from '../../../application/services/AuthService';
import { z } from 'zod';
import { logger } from '../../logger';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['STUDENT', 'INSTRUCTOR']).optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export class AuthController {
    constructor(private authService: AuthService) {}

    register = async (req: Request, res: Response) => {
        try {
            const data = registerSchema.parse(req.body);
            const response = await this.authService.register(data);
            res.status(201).json({ success: true, data: response });
        } catch (error: any) {
            logger.error(`Registration error: ${error.message}`);
            res.status(400).json({ success: false, message: error.message });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const data = loginSchema.parse(req.body);
            const response = await this.authService.login(data);
            res.status(200).json({ success: true, data: response });
        } catch (error: any) {
            logger.error(`Login error: ${error.message}`);
            res.status(401).json({ success: false, message: error.message });
        }
    };
}
