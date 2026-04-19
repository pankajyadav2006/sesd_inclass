import { EnrollmentRepository } from '../../infrastructure/database/repositories/EnrollmentRepository';
import { WaitlistRepository } from '../../infrastructure/database/repositories/WaitlistRepository';
import { ICourseRepository } from '../../domain/repositories/ICourseRepository';
import { logger } from '../../infrastructure/logger';

export class EnrollmentService {
    constructor(
        private enrollmentRepo: EnrollmentRepository,
        private waitlistRepo: WaitlistRepository,
        private courseRepo: ICourseRepository
    ) {}

    async enrollStudent(studentId: string, courseId: string): Promise<{ status: string, message: string }> {
        const course = await this.courseRepo.findById(courseId);
        if (!course) throw new Error('Course not found');

        const activeExists = await this.enrollmentRepo.findActive(studentId, courseId);
        if (activeExists) throw new Error('Already enrolled');

        const activeCount = await this.enrollmentRepo.countActiveByCourse(courseId);
        
        if (activeCount >= course.capacity) {
            await this.waitlistRepo.addToWaitlist(studentId, courseId);
            return { status: 'WAITLISTED', message: 'Course is full. Added to waitlist.' };
        }

        await this.enrollmentRepo.create(studentId, courseId);
        return { status: 'ENROLLED', message: 'Successfully enrolled.' };
    }

    async dropCourse(studentId: string, courseId: string): Promise<void> {
        const dropped = await this.enrollmentRepo.drop(studentId, courseId);
        if (!dropped) throw new Error('Active enrollment not found');

        // Check Waitlist for auto-enrollment
        const nextInLine = await this.waitlistRepo.getFirstPending(courseId);
        if (nextInLine) {
            logger.info(`Promoting student ${nextInLine.studentId} from waitlist for course ${courseId}`);
            await this.enrollmentRepo.create(nextInLine.studentId.toString(), courseId);
            await this.waitlistRepo.promoteWaitlistEntry(nextInLine._id);
            // Optionally: Emit domain event to NotificationService to notify the promoted student
        }
    }

    async getMyEnrollments(studentId: string) {
        return this.enrollmentRepo.getStudentEnrollments(studentId);
    }
}
