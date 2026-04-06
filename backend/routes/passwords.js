const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Password = require('../models/Password');
const authMiddleware = require('../middleware/auth');
const { encrypt, decrypt } = require('../config/encryption');

// All routes are protected
router.use(authMiddleware);

// @route   GET /api/passwords
// @desc    Get all passwords for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { user: req.user.id };

    if (category && category !== 'All') {
      query.category = category;
    }

    const passwords = await Password.find(query).sort({ updatedAt: -1 });

    // Decrypt passwords before sending
    const decryptedPasswords = passwords.map((pwd) => ({
      _id: pwd._id,
      title: pwd.title,
      username: pwd.username,
      email: pwd.email,
      password: decrypt(pwd.encryptedPassword),
      website: pwd.website,
      category: pwd.category,
      notes: pwd.notes,
      isFavorite: pwd.isFavorite,
      createdAt: pwd.createdAt,
      updatedAt: pwd.updatedAt,
    }));

    // Apply search filter on decrypted data
    let result = decryptedPasswords;
    if (search) {
      const s = search.toLowerCase();
      result = decryptedPasswords.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.username.toLowerCase().includes(s) ||
          p.website.toLowerCase().includes(s)
      );
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/passwords/:id
// @desc    Get single password
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const pwd = await Password.findOne({ _id: req.params.id, user: req.user.id });
    if (!pwd) return res.status(404).json({ message: 'Password not found' });

    res.json({
      _id: pwd._id,
      title: pwd.title,
      username: pwd.username,
      email: pwd.email,
      password: decrypt(pwd.encryptedPassword),
      website: pwd.website,
      category: pwd.category,
      notes: pwd.notes,
      isFavorite: pwd.isFavorite,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/passwords
// @desc    Add new password
// @access  Private
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, username, email, password, website, category, notes, isFavorite } = req.body;

    try {
      const encryptedPassword = encrypt(password);

      const newPassword = await Password.create({
        user: req.user.id,
        title,
        username: username || '',
        email: email || '',
        encryptedPassword,
        website: website || '',
        category: category || 'Other',
        notes: notes || '',
        isFavorite: isFavorite || false,
      });

      res.status(201).json({
        _id: newPassword._id,
        title: newPassword.title,
        username: newPassword.username,
        email: newPassword.email,
        password,
        website: newPassword.website,
        category: newPassword.category,
        notes: newPassword.notes,
        isFavorite: newPassword.isFavorite,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// @route   PUT /api/passwords/:id
// @desc    Update password
// @access  Private
router.put('/:id', async (req, res) => {
  const { title, username, email, password, website, category, notes, isFavorite } = req.body;

  try {
    const pwd = await Password.findOne({ _id: req.params.id, user: req.user.id });
    if (!pwd) return res.status(404).json({ message: 'Password not found' });

    if (title !== undefined) pwd.title = title;
    if (username !== undefined) pwd.username = username;
    if (email !== undefined) pwd.email = email;
    if (password !== undefined) pwd.encryptedPassword = encrypt(password);
    if (website !== undefined) pwd.website = website;
    if (category !== undefined) pwd.category = category;
    if (notes !== undefined) pwd.notes = notes;
    if (isFavorite !== undefined) pwd.isFavorite = isFavorite;

    await pwd.save();

    res.json({
      _id: pwd._id,
      title: pwd.title,
      username: pwd.username,
      email: pwd.email,
      password: password || decrypt(pwd.encryptedPassword),
      website: pwd.website,
      category: pwd.category,
      notes: pwd.notes,
      isFavorite: pwd.isFavorite,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/passwords/:id
// @desc    Delete password
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const pwd = await Password.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!pwd) return res.status(404).json({ message: 'Password not found' });

    res.json({ message: 'Password deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/passwords/:id/favorite
// @desc    Toggle favorite
// @access  Private
router.patch('/:id/favorite', async (req, res) => {
  try {
    const pwd = await Password.findOne({ _id: req.params.id, user: req.user.id });
    if (!pwd) return res.status(404).json({ message: 'Password not found' });

    pwd.isFavorite = !pwd.isFavorite;
    await pwd.save();

    res.json({ isFavorite: pwd.isFavorite });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
