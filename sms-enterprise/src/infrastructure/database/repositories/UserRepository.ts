import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User, CreateUserDTO } from '../../../domain/entities/User';
import { UserModel } from '../models/UserModel';

export class UserRepository implements IUserRepository {
    private mapToEntity(doc: any): User {
        return {
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            passwordHash: doc.passwordHash,
            role: doc.role,
            isVerified: doc.isVerified,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }

    async findById(id: string): Promise<User | null> {
        const doc = await UserModel.findById(id);
        return doc ? this.mapToEntity(doc) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({ email });
        return doc ? this.mapToEntity(doc) : null;
    }

    async create(data: CreateUserDTO): Promise<User> {
        const doc = new UserModel(data);
        await doc.save();
        return this.mapToEntity(doc);
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        const doc = await UserModel.findByIdAndUpdate(id, data, { new: true });
        return doc ? this.mapToEntity(doc) : null;
    }
}
