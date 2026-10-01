const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { protect, admin } = require('../middleware/auth');

// @desc    Create report
// @route   POST /api/reports
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { photo, reason } = req.body;
    const report = await Report.create({
      photo,
      reportedBy: req.user._id,
      reason
    });
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name')
      .populate('photo', 'title imageUrl publicId');
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
