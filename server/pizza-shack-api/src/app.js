import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : '';
const API_VERSION = process.env.API_VERSION || 'v1';

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [CORS_ORIGIN, 'http://localhost:5174'],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images from frontend's public directory
const frontendPublicPath = path.join(
  __dirname,
  '../../..',
  'apps/pizza-order-app/public'
);
app.use('/images', express.static(path.join(frontendPublicPath, 'images')));
console.log(
  '📁 Serving static images from:',
  path.join(frontendPublicPath, 'images')
);

// Request logging
app.use(requestLogger);

// API Routes
app.use(`/api/${API_VERSION}`, routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Pizza Shack API',
    version: API_VERSION,
    endpoints: {
      health: `/api/${API_VERSION}/health`,
      menu: `/api/${API_VERSION}/menu`,
      orders: `/api/${API_VERSION}/orders`,
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
