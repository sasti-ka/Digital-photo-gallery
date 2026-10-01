import api from './api';

/**
 * Photo service - all API calls related to photos
 */

export const getPhotos = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/photos?${query}`);
};

export const getPhotoById = (id) => api.get(`/photos/${id}`);

export const uploadPhoto = (formData) =>
  api.post('/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updatePhoto = (id, data) => api.put(`/photos/${id}`, data);

export const deletePhoto = (id) => api.delete(`/photos/${id}`);

export const likePhoto = (id) => api.post(`/photos/${id}/like`);

export const favoritePhoto = (id) => api.post(`/photos/${id}/favorite`);
