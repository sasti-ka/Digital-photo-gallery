const express = require('express');
const router = express.Router();
const {
  createAlbum,
  getAlbums,
  getMyAlbums,
  getAlbum,
  updateAlbum,
  deleteAlbum,
  addPhotoToAlbum,
  removePhotoFromAlbum
} = require('../controllers/albumsController');
const { protect } = require('../middleware/auth');

// Must come before /:id to avoid conflict
router.get('/my', protect, getMyAlbums);

router.route('/')
  .get(protect, getAlbums)
  .post(protect, createAlbum);

router.route('/:id')
  .get(protect, getAlbum)
  .put(protect, updateAlbum)
  .delete(protect, deleteAlbum);

router.post('/:id/photos', protect, addPhotoToAlbum);
router.delete('/:id/photos/:photoId', protect, removePhotoFromAlbum);

module.exports = router;
