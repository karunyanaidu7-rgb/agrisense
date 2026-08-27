import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { aiGenerationLimiter } from '../middleware/rateLimiter';
import {
  createAdvisory,
  getAdvisories,
  getAdvisoryById,
  deleteAdvisory,
} from '../controllers/advisoryController';

const router = Router();

// Apply authorization middleware to all advisory routes
router.use(requireAuth);

router.post('/', aiGenerationLimiter, createAdvisory);
router.get('/', getAdvisories);
router.get('/:id', getAdvisoryById);
router.delete('/:id', deleteAdvisory);

export default router;
