export interface Grade {
    id: string;
    studentId: string;
    courseId: string;
    instructorId: string;
    score: number;
    letterGrade: string;
    comments?: string;
    awardedAt: Date;
}
