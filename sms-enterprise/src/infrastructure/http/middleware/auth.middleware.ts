import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../../domain/entities/User';
import { logger } from '../../logger';

export interface AuthenticatedRequest extends Request {
    user?: { id: string; role: UserRole; name: string };
}

export const authenticateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        req.user = decoded;
        next();
    } catch (err) {
        logger.error('JWT Verification Failed');
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export const requireRole = (roles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
