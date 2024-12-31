

import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import { validateBiography } from '../validators/biography.validator.js';
import {
  createBiography,
  getBiographies,
  getBiographyBySlug,
  updateBiography,
  deleteBiography,
  getFeaturedBiographies,
} from '../controllers/biography.controller.js';

const router = express.Router();

router.route('/')
  .get(getBiographies)
  .post(protect, validateBiography, createBiography);

router.get('/slug/:slug', getBiographyBySlug);

router.route('/:id')
  .patch(protect, validateBiography, updateBiography)
  .delete(protect, deleteBiography);

// Admin routes
router.get('/admin/all', protect, admin, async (req, res) => {
  const biographies = await Biography.find().populate('author');
  res.json(biographies);
});

// Add this route to the existing routes
router.get('/featured', getFeaturedBiographies);

export default router;