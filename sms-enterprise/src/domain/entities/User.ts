export enum UserRole {
    STUDENT = 'STUDENT',
    INSTRUCTOR = 'INSTRUCTOR',
    ADMIN = 'ADMIN'
}

export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    isVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateUserDTO = Omit<User, 'id' | 'isVerified' | 'createdAt' | 'updatedAt'>;
