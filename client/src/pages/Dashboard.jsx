import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import PhotoCard from '../components/PhotoCard';
import { Image as ImageIcon, Folder, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ photos: 0, albums: 0, favorites: 0, views: 0 });
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all photos and albums by user concurrently
        const [photosRes, albumsRes] = await Promise.all([
          api.get(`/photos/user/${user._id}`),
          api.get('/albums/my')
        ]);
        
        const userPhotos = photosRes.data.photos || [];
        const userAlbums = albumsRes.data.albums || [];
        
        const totalViews = userPhotos.reduce((acc, curr) => acc + (curr.views || 0), 0);
        
        setStats({
          photos: userPhotos.length,
          albums: userAlbums.length,
          favorites: user.favorites ? user.favorites.length : 0,
          views: totalViews
        });
        
        setRecentPhotos(userPhotos.slice(0, 4));
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
        <Link to="/upload" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90">
          Upload Photo
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-6 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Total Media</span>
          </div>
          <span className="text-3xl font-bold">{stats.photos}</span>
        </div>
        <div className="bg-card border rounded-xl p-6 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <Folder className="w-5 h-5" />
            <span className="font-medium">Total Albums</span>
          </div>
          <span className="text-3xl font-bold">{stats.albums}</span>
        </div>
        <div className="bg-card border rounded-xl p-6 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <Heart className="w-5 h-5" />
            <span className="font-medium">Favorites</span>
          </div>
          <span className="text-3xl font-bold">{stats.favorites}</span>
        </div>
        <div className="bg-card border rounded-xl p-6 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Total Views</span>
          </div>
          <span className="text-3xl font-bold">{stats.views}</span>
        </div>
      </div>

      {/* Recent Photos */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Uploads</h2>
          <Link to="/explore" className="text-primary hover:underline">View Gallery</Link>
        </div>
        
        {recentPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentPhotos.map(photo => (
              <PhotoCard key={photo._id} photo={photo} />
            ))}
          </div>
        ) : (
          <div className="bg-muted border rounded-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No media uploaded yet</h3>
            <p className="text-muted-foreground mb-4">Start building your gallery by uploading your first photo or video.</p>
            <Link to="/upload" className="inline-flex bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90">
              Upload Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
