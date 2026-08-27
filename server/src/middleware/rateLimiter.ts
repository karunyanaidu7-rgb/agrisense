import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter: max 100 requests per 15 minutes.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict AI rate limiter: max 5 requests per 15 minutes per IP.
 * This prevents abuse and controls costs of the Gemini API.
 */
export const aiGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Daily/hourly AI advisory generation limit reached. Please wait before requesting another advisory.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
