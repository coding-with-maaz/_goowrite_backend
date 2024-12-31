import mongoose from 'mongoose';

const biographySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  profilePhoto: String,
  coverPhoto: String,
  quickInfo: {
    role: String,
    location: String,
    experience: String,
    specialization: String,
  },
  biography: {
    type: String,
    required: true,
  },
  personalLife: String,
  career: [{
    year: String,
    position: String,
    description: String,
  }],
  gallery: [String],
  socialMedia: {
    linkedin: String,
    twitter: String,
    github: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export const Biography = mongoose.model('Biography', biographySchema);