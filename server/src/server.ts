import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { generalLimiter } from './middleware/rateLimiter';
import advisoryRoutes from './routes/advisoryRoutes';

const app = express();

// 1. Basic security and cross-origin setup
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2. Body parsing options (restricted payload size for security)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 3. Global rate limiting
app.use(generalLimiter);

// 4. API Routes
// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Agriculture Advisory API is running',
  });
});

// Advisory Routes
app.use('/api/advisories', advisoryRoutes);

// 5. Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled internal error:', err);

  const isProduction = env.NODE_ENV === 'production';
  
  res.status(err.status || 500).json({
    success: false,
    message: isProduction 
      ? 'Unable to process your request. A server error occurred.'
      : err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

// 6. Port listening
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`🌱 Agriculture Advisory Server listening on port ${PORT} in ${env.NODE_ENV} mode`);
});
