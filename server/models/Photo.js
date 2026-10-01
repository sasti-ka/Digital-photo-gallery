const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  publicId: { type: String, default: '' },
  originalFilename: { type: String, default: '' },
  fileType: { type: String, enum: ['image', 'video'], default: 'image' },
  mimeType: { type: String, default: '' },
  category: { type: String, default: 'Other' },
  tags: [{ type: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);
