import { User, CreateUserDTO } from '../entities/User';

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: CreateUserDTO): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User | null>;
}
