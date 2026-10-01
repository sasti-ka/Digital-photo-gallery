import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PhotoCard from '../components/PhotoCard';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const AlbumDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const { data } = await api.get(`/albums/${id}`);
        setAlbum(data.album);
      } catch (error) {
        toast.error('Album not found');
        navigate('/albums');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlbum();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this album? Photos will not be deleted.')) return;
    try {
      await api.delete(`/albums/${id}`);
      toast.success('Album deleted');
      navigate('/albums');
    } catch (error) {
      toast.error('Failed to delete album');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!album) return null;

  const isOwner = user && user._id === album.user._id;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        {isOwner && (
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button onClick={handleDelete} className="flex items-center space-x-2 px-4 py-2 border border-destructive/50 text-destructive rounded-md hover:bg-destructive/10 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-card rounded-2xl overflow-hidden border">
        {album.coverImage && (
          <div className="h-48 md:h-64 w-full relative">
            <img src={album.coverImage} alt={album.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        <div className={`p-6 md:p-8 ${album.coverImage ? '-mt-16 relative z-10' : ''}`}>
          <div className={`inline-block p-1 rounded-xl mb-4 ${album.coverImage ? 'bg-background' : ''}`}>
            <h1 className="text-3xl md:text-4xl font-bold px-2 py-1">{album.name}</h1>
          </div>
          {album.description && (
            <p className="text-muted-foreground text-lg max-w-2xl">{album.description}</p>
          )}
          <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
            <span>By {album.user.name}</span>
            <span>•</span>
            <span>{album.photos.length} photos</span>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h2 className="text-2xl font-semibold mb-6">Photos in this album</h2>
        
        {album.photos && album.photos.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {album.photos.map(photo => (
              <PhotoCard key={photo._id} photo={photo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted rounded-xl border">
            <h3 className="text-xl font-medium mb-2">This album is empty</h3>
            <p className="text-muted-foreground mb-4">Add some photos to get started.</p>
            {isOwner && (
              <Link to="/upload" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90">
                Upload Photos
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetails;
