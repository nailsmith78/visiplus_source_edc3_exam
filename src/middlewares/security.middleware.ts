import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env';

// Limitation des requêtes par IP pour prévenir les abus / brute force
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: env.NODE_ENV === "test" ? 25 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Trop de requetes via votre IP, merci d'essayer plus tard pour d'autres requetes"
});
