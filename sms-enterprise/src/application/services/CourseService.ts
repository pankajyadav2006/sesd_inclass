import { ICourseRepository } from '../../domain/repositories/ICourseRepository';
import { CreateCourseDTO, UpdateCourseDTO, Course } from '../../domain/entities/Course';

export class CourseService {
    constructor(private courseRepository: ICourseRepository) {}

    async createCourse(data: CreateCourseDTO, instructorId: string): Promise<Course> {
        // Business Rule: Ensure code is unique
        const existing = await this.courseRepository.findByCode(data.code);
        if (existing) {
            throw new Error(`Course with code ${data.code} already exists.`);
        }

        const coursePayload = { ...data, instructorId };
        return this.courseRepository.create(coursePayload);
    }

    async getCourses(page: number = 1, limit: number = 10, search?: string) {
        const filters: any = {};
        if (search) {
            filters.$or = [
                { title: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } }
            ];
        }
        return this.courseRepository.findAll(page, limit, filters);
    }

    async getCourseById(id: string): Promise<Course> {
        const course = await this.courseRepository.findById(id);
        if (!course) {
            throw new Error('Course not found');
        }
        return course;
    }

    async updateCourse(id: string, data: UpdateCourseDTO, userId: string, role: string): Promise<Course> {
        const course = await this.getCourseById(id);
        if (role !== 'ADMIN' && course.instructorId !== userId) {
            throw new Error('Forbidden: You can only edit your own courses');
        }
        
        const updated = await this.courseRepository.update(id, data);
        return updated as Course;
    }

    async deleteCourse(id: string, userId: string, role: string): Promise<void> {
        const course = await this.getCourseById(id);
        if (role !== 'ADMIN' && course.instructorId !== userId) {
            throw new Error('Forbidden: You can only delete your own courses');
        }

        await this.courseRepository.softDelete(id);
    }
}
