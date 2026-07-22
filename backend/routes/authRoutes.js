import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  getVoters,
  createVoter,
  updateVoter,
  deleteVoter,
  changePassword,
  deleteAccount,
} from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/upload-avatar', protect, uploadAvatar);
router.put('/change-password', protect, changePassword);
router.post('/delete-account', protect, deleteAccount);

// Admin-only Voter Management routes
router.get('/voters', protect, authorize('admin'), getVoters);
router.post('/voters', protect, authorize('admin'), createVoter);
router.put('/voters/:id', protect, authorize('admin'), updateVoter);
router.delete('/voters/:id', protect, authorize('admin'), deleteVoter);

export default router;
