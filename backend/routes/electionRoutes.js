import express from 'express';
import {
  getElections,
  createElection,
  updateElection,
  toggleElectionStatus,
  deleteElection,
} from '../controllers/electionController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route to view elections
router.get('/', getElections);

// Admin-only write routes
router.post('/', protect, authorize('admin'), createElection);
router.put('/:id', protect, authorize('admin'), updateElection);
router.put('/:id/toggle-status', protect, authorize('admin'), toggleElectionStatus);
router.delete('/:id', protect, authorize('admin'), deleteElection);

export default router;
