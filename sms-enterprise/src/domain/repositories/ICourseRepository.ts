import { Course, CreateCourseDTO, UpdateCourseDTO } from '../entities/Course';

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface ICourseRepository {
    findById(id: string): Promise<Course | null>;
    findByCode(code: string): Promise<Course | null>;
    findAll(page: number, limit: number, filters?: any): Promise<PaginatedResult<Course>>;
    create(data: CreateCourseDTO): Promise<Course>;
    update(id: string, data: UpdateCourseDTO): Promise<Course | null>;
    softDelete(id: string): Promise<boolean>;
}
