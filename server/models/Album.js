const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }]
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);
