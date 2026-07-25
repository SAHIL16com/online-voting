import express from 'express';
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from '../controllers/candidateController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected route to view candidates (scoped by user's adminId)
router.get('/', protect, getCandidates);

// Admin-only write routes
router.post('/', protect, authorize('admin'), createCandidate);
router.put('/:id', protect, authorize('admin'), updateCandidate);
router.delete('/:id', protect, authorize('admin'), deleteCandidate);

export default router;
