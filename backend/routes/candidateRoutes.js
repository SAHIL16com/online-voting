import express from 'express';
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from '../controllers/candidateController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route to view candidates
router.get('/', getCandidates);

// Admin-only write routes
router.post('/', protect, authorize('admin'), createCandidate);
router.put('/:id', protect, authorize('admin'), updateCandidate);
router.delete('/:id', protect, authorize('admin'), deleteCandidate);

export default router;
