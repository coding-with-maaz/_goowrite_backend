import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate.middleware.js';

export const validateBiography = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
    
  body('biography')
    .trim()
    .notEmpty()
    .withMessage('Biography content is required')
    .isLength({ min: 100 })
    .withMessage('Biography must be at least 100 characters'),
    
  body('quickInfo')
    .optional()
    .isObject()
    .withMessage('Quick info must be an object'),
    
  body('quickInfo.role')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Role cannot be empty'),
    
  body('career')
    .optional()
    .isArray()
    .withMessage('Career must be an array'),
    
  body('career.*.year')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Career year is required'),
    
  body('career.*.position')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Career position is required'),
    
  validateRequest,
];