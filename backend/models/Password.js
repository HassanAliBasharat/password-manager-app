const mongoose = require('mongoose');

const PasswordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    encryptedPassword: {
      type: String,
      required: [true, 'Password is required'],
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['Social Media', 'Banking', 'Email', 'Shopping', 'Work', 'Other'],
      default: 'Other',
    },
    notes: {
      type: String,
      default: '',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Password', PasswordSchema);
