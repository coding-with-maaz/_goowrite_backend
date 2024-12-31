import { User } from '../models/user.model.js';
import { AppError } from '../utils/appError.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        throw new AppError('Email already exists', 400);
      }
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;
    
    const updatedUser = await user.save();
    
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    next(error);
  }
};