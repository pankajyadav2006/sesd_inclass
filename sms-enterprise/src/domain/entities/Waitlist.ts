export enum WaitlistStatus {
    PENDING = 'PENDING',
    PROMOTED = 'PROMOTED',
    EXPIRED = 'EXPIRED'
}

export interface Waitlist {
    id: string;
    studentId: string;
    courseId: string;
    position: number;
    status: WaitlistStatus;
    joinedAt: Date;
}
