export interface Course {
    id: string;
    code: string;
    title: string;
    description: string;
    credits: number;
    capacity: number;
    instructorId: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export type CreateCourseDTO = Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateCourseDTO = Partial<CreateCourseDTO>;
