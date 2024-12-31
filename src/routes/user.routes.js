import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import { validateUpdateProfile } from '../validators/user.validator.js';
import { getProfile, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, validateUpdateProfile, updateProfile);

// Admin routes
router.get('/', protect, admin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

export default router;