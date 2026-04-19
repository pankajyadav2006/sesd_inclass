import { UserRole } from '../../domain/entities/User';

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}
