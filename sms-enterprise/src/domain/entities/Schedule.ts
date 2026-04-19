export enum DayOfWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}

export interface Schedule {
    id: string;
    courseId: string;
    dayOfWeek: DayOfWeek;
    startTime: string; // 'HH:mm' format
    endTime: string;
    room: string;
}
