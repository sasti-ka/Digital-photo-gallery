const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Photo = require('../models/Photo');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await user.deleteOne();
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all photos (for admin dashboard)
// @route   GET /api/admin/photos
// @access  Private/Admin
router.get('/photos', protect, admin, async (req, res) => {
  try {
    const photos = await Photo.find().populate('user', 'name');
    res.json({ success: true, photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete photo (admin)
// @route   DELETE /api/admin/photos/:id
// @access  Private/Admin
router.delete('/photos/:id', protect, admin, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });
    
    // Remove the file from local uploads
    const fs = require('fs');
    const path = require('path');
    if (photo.publicId) {
      const filePath = path.join(__dirname, '..', 'uploads', photo.publicId);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    
    await photo.deleteOne();
    res.json({ success: true, message: 'Photo removed by admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
