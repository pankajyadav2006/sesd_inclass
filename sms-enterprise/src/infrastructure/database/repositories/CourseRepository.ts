import { ICourseRepository, PaginatedResult } from '../../../domain/repositories/ICourseRepository';
import { Course, CreateCourseDTO, UpdateCourseDTO } from '../../../domain/entities/Course';
import { CourseModel } from '../models/CourseModel';

export class CourseRepository implements ICourseRepository {
    private mapToEntity(doc: any): Course {
        return {
            id: doc._id.toString(),
            code: doc.code,
            title: doc.title,
            description: doc.description,
            credits: doc.credits,
            capacity: doc.capacity,
            instructorId: doc.instructorId.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            deletedAt: doc.deletedAt
        };
    }

    async findById(id: string): Promise<Course | null> {
        const doc = await CourseModel.findOne({ _id: id, deletedAt: null });
        return doc ? this.mapToEntity(doc) : null;
    }

    async findByCode(code: string): Promise<Course | null> {
        const doc = await CourseModel.findOne({ code, deletedAt: null });
        return doc ? this.mapToEntity(doc) : null;
    }

    async findAll(page: number, limit: number, filters: any = {}): Promise<PaginatedResult<Course>> {
        const query = { ...filters, deletedAt: null };
        const total = await CourseModel.countDocuments(query);
        const docs = await CourseModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        return {
            data: docs.map(doc => this.mapToEntity(doc)),
            total,
            page,
            limit
        };
    }

    async create(data: CreateCourseDTO): Promise<Course> {
        const doc = new CourseModel(data);
        await doc.save();
        return this.mapToEntity(doc);
    }

    async update(id: string, data: UpdateCourseDTO): Promise<Course | null> {
        const doc = await CourseModel.findOneAndUpdate(
            { _id: id, deletedAt: null }, 
            data, 
            { new: true }
        );
        return doc ? this.mapToEntity(doc) : null;
    }

    async softDelete(id: string): Promise<boolean> {
        const doc = await CourseModel.findByIdAndUpdate(id, { deletedAt: new Date() });
        return !!doc;
    }
}
