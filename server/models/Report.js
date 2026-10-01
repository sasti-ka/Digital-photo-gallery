const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  photo: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
