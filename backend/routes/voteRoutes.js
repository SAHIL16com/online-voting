import express from 'express';
import { castVote, checkHasVoted } from '../controllers/voteController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected voting routes for logged-in voters
router.post('/cast', protect, castVote);
router.get('/check/:electionId', protect, checkHasVoted);

export default router;
