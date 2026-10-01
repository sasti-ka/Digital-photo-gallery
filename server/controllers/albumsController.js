const Album = require('../models/Album');
const Photo = require('../models/Photo');

// @desc    Create album
// @route   POST /api/albums
// @access  Private
const createAlbum = async (req, res) => {
  try {
    const { name, description, coverImage } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Album name is required' });
    }
    
    const album = await Album.create({
      name: name.trim(),
      description: description || '',
      coverImage: coverImage || '',
      user: req.user._id,
    });
    
    res.status(201).json({ success: true, album });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all albums
// @route   GET /api/albums
// @access  Public
const getAlbums = async (req, res) => {
  try {
    // Only the logged-in user's own albums
    const albums = await Album.find({ user: req.user._id }).populate('user', 'name profileImage');
    res.json({ success: true, albums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's albums
// @route   GET /api/albums/my
// @access  Private
const getMyAlbums = async (req, res) => {
  try {
    const albums = await Album.find({ user: req.user._id })
      .populate('user', 'name profileImage')
      .populate('photos');
    res.json({ success: true, albums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single album
// @route   GET /api/albums/:id
// @access  Public
const getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('user', 'name profileImage')
      .populate({
        path: 'photos',
        populate: { path: 'user', select: 'name' }
      });
      
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    const ownerId = album.user && album.user._id ? album.user._id : album.user;
    if (String(ownerId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'This album is private' });
    }
    
    res.json({ success: true, album });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update album
// @route   PUT /api/albums/:id
// @access  Private
const updateAlbum = async (req, res) => {
  try {
    let album = await Album.findById(req.params.id);
    
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }
    
    if (album.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { name, description, coverImage, photos } = req.body;
    
    album.name = name || album.name;
    album.description = description !== undefined ? description : album.description;
    album.coverImage = coverImage || album.coverImage;
    
    if (photos) {
      album.photos = photos;
    }

    await album.save();
    res.json({ success: true, album });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete album
// @route   DELETE /api/albums/:id
// @access  Private
const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    if (album.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Unlink photos from this album
    await Photo.updateMany({ album: req.params.id }, { $unset: { album: 1 } });
    
    await album.deleteOne();
    res.json({ success: true, message: 'Album removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add photo to album
// @route   POST /api/albums/:id/photos
// @access  Private
const addPhotoToAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    if (album.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { photoId } = req.body;
    
    if (!photoId) {
      return res.status(400).json({ success: false, message: 'Photo ID is required' });
    }

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    if (photo.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only add your own photos' });
    }

    // Add photo to album if not already there
    if (!album.photos.includes(photoId)) {
      album.photos.push(photoId);
      await album.save();
    }

    // Update the photo's album reference
    photo.album = album._id;
    await photo.save();

    res.json({ success: true, album });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove photo from album
// @route   DELETE /api/albums/:id/photos/:photoId
// @access  Private
const removePhotoFromAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    if (album.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    album.photos = album.photos.filter(p => p.toString() !== req.params.photoId);
    await album.save();

    // Remove album reference from photo
    await Photo.findByIdAndUpdate(req.params.photoId, { $unset: { album: 1 } });

    res.json({ success: true, album });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAlbum,
  getAlbums,
  getMyAlbums,
  getAlbum,
  updateAlbum,
  deleteAlbum,
  addPhotoToAlbum,
  removePhotoFromAlbum
};
