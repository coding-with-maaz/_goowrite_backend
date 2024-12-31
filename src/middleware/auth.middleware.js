import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/appError.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError('Not authorized', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    next(new AppError('Not authorized', 401));
  }
};

export const admin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Not authorized as admin', 403));
  }
  next();
};