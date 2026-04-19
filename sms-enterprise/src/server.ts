import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from './infrastructure/logger';

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI as string;

async function bootstrap() {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info('Connected to MongoDB Enterprise Datastore');

        app.listen(PORT, () => {
            logger.info(`Enterprise SMS Backend running on port ${PORT}`);
            logger.info(`Swagger Docs: http://localhost:${PORT}/api-docs`);
        });
    } catch (err) {
        logger.error('Failed to connect to database', err);
        process.exit(1);
    }
}

bootstrap();
