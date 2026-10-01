const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  bio: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }]
}, { timestamps: true });

// Hash the password with bcrypt before saving.
// NOTE: what you see in MongoDB ($2b$10$...) is the bcrypt hash - this is the
// correct, secure way to store passwords. Never store them as plain text.
userSchema.pre('save', async function () {
  // Only re-hash when the password was actually changed. (Previously the hook
  // kept running after next() and re-hashed an already-hashed password on every
  // save, e.g. when favoriting a photo, which made that user unable to log in.)
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
