export enum EnrollmentStatus {
    ACTIVE = 'ACTIVE',
    DROPPED = 'DROPPED',
    COMPLETED = 'COMPLETED'
}

export interface Enrollment {
    id: string;
    studentId: string;
    courseId: string;
    status: EnrollmentStatus;
    enrolledAt: Date;
    droppedAt?: Date | null;
}

export type CreateEnrollmentDTO = Omit<Enrollment, 'id' | 'status' | 'enrolledAt' | 'droppedAt'>;
