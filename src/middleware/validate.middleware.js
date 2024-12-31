import { validationResult } from 'express-validator';
import { AppError } from '../utils/appError.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    throw new AppError(messages[0], 400);
  }
  next();
};