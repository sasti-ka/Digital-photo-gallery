import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * usePhotos - Fetch photos with optional search/category filters
 * Usage: const { photos, loading, refetch } = usePhotos({ search, category, sort });
 */
const usePhotos = ({ search = '', category = 'All', sort = '' } = {}) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (sort) params.append('sort', sort);

      const { data } = await api.get(`/photos?${params.toString()}`);
      setPhotos(data.photos);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return { photos, loading, error, refetch: fetchPhotos };
};

export default usePhotos;
