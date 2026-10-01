export const CATEGORIES = [
  'All',
  'Nature',
  'Travel',
  'People',
  'Events',
  'Food',
  'Architecture',
  'Animals',
  'Other',
];

export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Most Viewed', value: 'mostViewed' },
  { label: 'Most Liked', value: 'mostLiked' },
];

export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
