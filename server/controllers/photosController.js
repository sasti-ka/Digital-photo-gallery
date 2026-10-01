const Photo = require('../models/Photo');
const fs = require('fs');
const path = require('path');

// A photo is private to the user who uploaded it (admins can see everything).
const isOwnerOrAdmin = (ownerId, user) => {
  const id = ownerId && ownerId._id ? ownerId._id : ownerId;
  return user.role === 'admin' || String(id) === String(user._id);
};

// @desc    Upload new photo/video
// @route   POST /api/photos
// @access  Private
const uploadPhoto = async (req, res) => {
  try {
    const { title, description, category, tags, album } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image or video' });
    }

    // Store a relative path (not a full host URL) so images keep working if the
    // server host/port changes. The client prefixes the server address.
    const imageUrl = `/uploads/${req.file.filename}`;
    const thumbnailUrl = imageUrl; // For local storage, thumbnail = same file

    // Determine if it's image or video
    const isVideo = req.file.mimetype.startsWith('video/');
    const fileType = isVideo ? 'video' : 'image';

    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [];

    const photoData = {
      title,
      description,
      imageUrl,
      thumbnailUrl,
      publicId: req.file.filename,
      originalFilename: req.file.originalname,
      fileType,
      mimeType: req.file.mimetype,
      category,
      tags: parsedTags,
      user: req.user._id,
    };

    if (album) {
      const Album = require('../models/Album');
      const ownAlbum = await Album.findOne({ _id: album, user: req.user._id });
      if (!ownAlbum) {
        return res.status(403).json({ success: false, message: 'You can only add photos to your own albums' });
      }
      photoData.album = album;
    }

    const photo = await Photo.create(photoData);

    // If photo belongs to an album, add it to the album's photos array
    if (album) {
      const Album = require('../models/Album');
      await Album.findByIdAndUpdate(album, { $addToSet: { photos: photo._id } });
    }

    res.status(201).json({ success: true, photo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all photos
// @route   GET /api/photos
// @access  Private (own photos only)
const getPhotos = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    
    // Only the logged-in user's own photos
    let query = { user: req.user._id };
    if (search) {
      query.$and = [{ $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ] }];
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'mostViewed') sortOptions = { views: -1 };
    if (sort === 'mostLiked') sortOptions = { likes: -1 };

    const photos = await Photo.find(query)
      .populate('user', 'name profileImage')
      .sort(sortOptions);
      
    res.json({ success: true, photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single photo
// @route   GET /api/photos/:id
// @access  Public
const getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('user', 'name profileImage bio')
      .populate('album', 'name');
      
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    if (!isOwnerOrAdmin(photo.user, req.user)) {
      return res.status(403).json({ success: false, message: 'This photo is private' });
    }
    
    // Increment view count
    photo.views += 1;
    await photo.save();

    res.json({ success: true, photo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update photo
// @route   PUT /api/photos/:id
// @access  Private
const updatePhoto = async (req, res) => {
  try {
    let photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    
    if (photo.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { title, description, category, tags } = req.body;
    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : photo.tags;

    photo.title = title || photo.title;
    photo.description = description !== undefined ? description : photo.description;
    photo.category = category || photo.category;
    photo.tags = parsedTags;

    await photo.save();

    res.json({ success: true, photo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete photo
// @route   DELETE /api/photos/:id
// @access  Private
const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    if (photo.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Delete the file from local uploads
    if (photo.publicId) {
      const filePath = path.join(__dirname, '..', 'uploads', photo.publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove photo from its album if it belongs to one
    if (photo.album) {
      const Album = require('../models/Album');
      await Album.findByIdAndUpdate(photo.album, { $pull: { photos: photo._id } });
    }
    
    await photo.deleteOne();

    res.json({ success: true, message: 'Photo removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like/Unlike photo
// @route   POST /api/photos/:id/like
// @access  Private
const likePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    
    if (!isOwnerOrAdmin(photo.user, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const isLiked = photo.likes.includes(req.user._id);
    
    if (isLiked) {
      photo.likes = photo.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      photo.likes.push(req.user._id);
    }
    
    await photo.save();
    res.json({ success: true, likes: photo.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Favorite/Unfavorite photo
// @route   POST /api/photos/:id/favorite
// @access  Private
const favoritePhoto = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    const photoId = req.params.id;

    const target = await Photo.findById(photoId);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    if (!isOwnerOrAdmin(target.user, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const isFavorited = user.favorites.includes(photoId);
    
    if (isFavorited) {
      user.favorites = user.favorites.filter(id => id.toString() !== photoId);
    } else {
      user.favorites.push(photoId);
    }
    
    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get photos by user
// @route   GET /api/photos/user/:userId
// @access  Public
const getPhotosByUser = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req.params.userId, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const photos = await Photo.find({ user: req.params.userId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json({ success: true, photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadPhoto,
  getPhotos,
  getPhoto,
  updatePhoto,
  deletePhoto,
  likePhoto,
  favoritePhoto,
  getPhotosByUser
};
