const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

// @desc    Add comment to photo
// @route   POST /api/comments
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { photo, text } = req.body;
    const comment = await Comment.create({
      photo,
      user: req.user._id,
      text
    });
    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get comments for a photo
// @route   GET /api/comments/:photoId
// @access  Public
router.get('/:photoId', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ photo: req.params.photoId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    
    await comment.deleteOne();
    res.json({ success: true, message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
