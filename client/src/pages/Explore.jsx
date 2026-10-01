import { useState, useEffect } from 'react';
import api from '../services/api';
import PhotoCard from '../components/PhotoCard';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Nature', 'Travel', 'People', 'Events', 'Food', 'Architecture', 'Animals', 'Other'];

const Explore = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/photos', { params: { search, category } });
      setPhotos(data.photos);
    } catch (error) {
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPhotos();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search photos, tags..."
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                category === cat 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : photos.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo) => (
            <PhotoCard key={photo._id} photo={photo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">No photos found</h2>
          <p className="text-muted-foreground">Photos you upload will appear here. Only you can see them.</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
