import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PhotoCard from '../components/PhotoCard';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [favoritePhotos, setFavoritePhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // To get favorites, we could fetch all photos and filter based on user.favorites array
        // Or if the backend populates favorites, we can fetch from a dedicated route.
        // For now, let's fetch all photos and filter locally.
        const { data } = await api.get('/photos');
        const favoritesIds = user.favorites || [];
        const filtered = data.photos.filter(photo => favoritesIds.includes(photo._id));
        setFavoritePhotos(filtered);
      } catch (error) {
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Heart className="w-8 h-8 text-red-500 fill-current" />
        <h1 className="text-3xl font-bold">My Favorites</h1>
      </div>

      {favoritePhotos.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {favoritePhotos.map(photo => (
            <PhotoCard key={photo._id} photo={photo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted rounded-xl border">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No favorite memories yet.</h2>
          <p className="text-muted-foreground">Heart your favorite photos while browsing to see them here.</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
