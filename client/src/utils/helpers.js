/**
 * formatDate - Format a date string to readable format
 * Usage: formatDate('2024-01-15') => 'Jan 15, 2024'
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * formatNumber - Format large numbers with K/M suffix
 * Usage: formatNumber(2400) => '2.4K'
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

/**
 * truncateText - Truncate text to a max length
 * Usage: truncateText('Long title here', 20) => 'Long title here...'
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * getCloudinaryThumb - Generate a Cloudinary thumbnail URL from a full image URL
 * Usage: getCloudinaryThumb(imageUrl, 400)
 */
export const getCloudinaryThumb = (url, width = 400) => {
  if (!url || !url.includes('cloudinary')) return url;
  return url.replace('/upload/', `/upload/w_${width},c_scale,q_auto,f_auto/`);
};

/**
 * cn - Merge Tailwind class names (simple version)
 */
export const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * mediaUrl - Resolve a stored upload path to a full URL on the API server.
 * Handles relative paths ('/uploads/x.png') and old absolute URLs saved with a
 * different host/port ('http://127.0.0.1:5001/uploads/x.png').
 */
const SERVER_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
export const mediaUrl = (url) => {
  if (!url) return '';
  if (/^(data:|blob:)/.test(url)) return url;
  const idx = url.indexOf('/uploads/');
  if (idx !== -1) return `${SERVER_BASE}${url.slice(idx)}`;
  return url; // external (e.g. Cloudinary) URL
};

/** Shown when an image fails to load */
export const IMAGE_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' fill='%239ca3af' font-family='sans-serif' font-size='16' text-anchor='middle' dy='.3em'>Image unavailable</text></svg>";
export const onImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = IMAGE_FALLBACK;
};
