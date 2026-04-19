import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, UserRole } from '../../domain/entities/User';
import { RegisterDTO, LoginDTO, AuthResponse } from '../dtos/AuthDTO';

export class AuthService {
    constructor(private userRepository: IUserRepository) {}

    async register(data: RegisterDTO): Promise<AuthResponse> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(data.password, salt);

        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            passwordHash,
            role: data.role || UserRole.STUDENT
        });

        return this.generateAuthResponse(user);
    }

    async login(data: LoginDTO): Promise<AuthResponse> {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(data.password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return this.generateAuthResponse(user);
    }

    private generateAuthResponse(user: User): AuthResponse {
        const payload = { id: user.id, role: user.role, name: user.name };
        
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '7d' }
        );

        return {
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            tokens: { accessToken, refreshToken }
        };
    }
}
