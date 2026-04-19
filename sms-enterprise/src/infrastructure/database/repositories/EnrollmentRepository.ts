import { EnrollmentModel } from '../models/EnrollmentModel';
import { Enrollment, EnrollmentStatus } from '../../../domain/entities/Enrollment';

export class EnrollmentRepository {
    async countActiveByCourse(courseId: string): Promise<number> {
        return EnrollmentModel.countDocuments({ courseId, status: EnrollmentStatus.ACTIVE });
    }

    async findActive(studentId: string, courseId: string): Promise<boolean> {
        const doc = await EnrollmentModel.findOne({ studentId, courseId, status: EnrollmentStatus.ACTIVE });
        return !!doc;
    }

    async create(studentId: string, courseId: string): Promise<Enrollment> {
        const doc = new EnrollmentModel({ studentId, courseId });
        await doc.save();
        return {
            id: doc._id.toString(),
            studentId: doc.studentId.toString(),
            courseId: doc.courseId.toString(),
            status: doc.status,
            enrolledAt: doc.enrolledAt
        };
    }

    async drop(studentId: string, courseId: string): Promise<boolean> {
        const doc = await EnrollmentModel.findOneAndUpdate(
            { studentId, courseId, status: EnrollmentStatus.ACTIVE },
            { status: EnrollmentStatus.DROPPED, droppedAt: new Date() }
        );
        return !!doc;
    }

    async getStudentEnrollments(studentId: string): Promise<any[]> {
        return EnrollmentModel.find({ studentId }).populate('courseId');
    }
}
