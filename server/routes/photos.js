const express = require('express');
const router = express.Router();
const {
  uploadPhoto,
  getPhotos,
  getPhoto,
  updatePhoto,
  deletePhoto,
  likePhoto,
  favoritePhoto,
  getPhotosByUser
} = require('../controllers/photosController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(protect, getPhotos)
  .post(protect, upload.single('image'), uploadPhoto);

router.route('/:id')
  .get(protect, getPhoto)
  .put(protect, updatePhoto)
  .delete(protect, deletePhoto);

router.post('/:id/like', protect, likePhoto);
router.post('/:id/favorite', protect, favoritePhoto);
router.get('/user/:userId', protect, getPhotosByUser);

module.exports = router;
