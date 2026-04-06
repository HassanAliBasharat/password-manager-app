const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    masterPassword: {
      type: String,
      required: [true, 'Master password is required'],
      minlength: 8,
    },
  },
  { timestamps: true }
);

// Hash master password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('masterPassword')) return next();
  const salt = await bcrypt.genSalt(12);
  this.masterPassword = await bcrypt.hash(this.masterPassword, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.masterPassword);
};

module.exports = mongoose.model('User', UserSchema);
