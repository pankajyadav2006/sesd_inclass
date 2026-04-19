import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { logger } from './infrastructure/logger';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Swagger Docs Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Enterprise SMS API',
            version: '1.0.0',
            description: 'Student Management System API'
        },
        servers: [
            { url: 'http://localhost:8000/api/v1' }
        ],
        components: {
          securitySchemes: {
             bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
             }
          }
        },
        security: [{
           bearerAuth: []
        }]
    },
    apis: ['./src/infrastructure/http/routes/*.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Example Route for checking health
app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});

import authRoutes from './infrastructure/http/routes/auth.routes';
import courseRoutes from './infrastructure/http/routes/course.routes';
import enrollmentRoutes from './infrastructure/http/routes/enrollment.routes';

// We will mount routes here
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);

export default app;
