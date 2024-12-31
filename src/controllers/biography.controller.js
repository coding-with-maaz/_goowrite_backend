// Import dependencies
import { Biography } from '../models/biography.model.js';
import { AppError } from '../utils/appError.js';
import { slugify } from '../utils/slugify.js';

// Controller to fetch featured biographies
export const getFeaturedBiographies = async (req, res, next) => {
  try {
    const featuredBiographies = await Biography.find({ isFeatured: true })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(featuredBiographies);
  } catch (error) {
    next(error);
  }
};

// Controller to create a new biography
export const createBiography = async (req, res, next) => {
  try {
    const biography = new Biography({
      ...req.body,
      author: req.user._id,
      slug: slugify(req.body.title),
    });

    const savedBiography = await biography.save();
    res.status(201).json(savedBiography);
  } catch (error) {
    next(error);
  }
};

// Controller to fetch all biographies with pagination and filters
export const getBiographies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { biography: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query['quickInfo.specialization'] = category;
    }

    const biographies = await Biography.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Biography.countDocuments(query);

    res.json({
      biographies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch a biography by its slug
export const getBiographyBySlug = async (req, res, next) => {
  try {
    const biography = await Biography.findOne({ slug: req.params.slug })
      .populate('author', 'name email');

    if (!biography) {
      throw new AppError('Biography not found', 404);
    }

    res.json(biography);
  } catch (error) {
    next(error);
  }
};

// Controller to update a biography
export const updateBiography = async (req, res, next) => {
  try {
    const biography = await Biography.findById(req.params.id);

    if (!biography) {
      throw new AppError('Biography not found', 404);
    }

    if (biography.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this biography', 403);
    }

    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updatedBiography = await Biography.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedBiography);
  } catch (error) {
    next(error);
  }
};

// Controller to delete a biography
export const deleteBiography = async (req, res, next) => {
  try {
    const biography = await Biography.findById(req.params.id);

    if (!biography) {
      throw new AppError('Biography not found', 404);
    }

    if (biography.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this biography', 403);
    }

    await biography.deleteOne();
    res.json({ message: 'Biography removed' });
  } catch (error) {
    next(error);
  }s
};
