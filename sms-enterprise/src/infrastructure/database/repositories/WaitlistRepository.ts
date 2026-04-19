import { WaitlistModel } from '../models/WaitlistModel';
import { WaitlistStatus } from '../../../domain/entities/Waitlist';

export class WaitlistRepository {
    async addToWaitlist(studentId: string, courseId: string): Promise<any> {
        const position = await WaitlistModel.countDocuments({ courseId, status: WaitlistStatus.PENDING }) + 1;
        const doc = new WaitlistModel({ studentId, courseId, position });
        await doc.save();
        return doc;
    }

    async getFirstPending(courseId: string): Promise<any | null> {
        return WaitlistModel.findOne({ courseId, status: WaitlistStatus.PENDING }).sort({ position: 1 });
    }

    async promoteWaitlistEntry(id: string): Promise<void> {
        await WaitlistModel.findByIdAndUpdate(id, { status: WaitlistStatus.PROMOTED });
    }
}
