import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FolderPlus, Image as ImageIcon, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Albums = () => {
  const { user } = useContext(AuthContext);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchAlbums = async () => {
    try {
      const { data } = await api.get('/albums/my');
      setAlbums(data.albums);
    } catch (error) {
      toast.error('Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, [user]);

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumName.trim()) {
      return toast.error('Please enter an album name');
    }

    setIsCreating(true);
    try {
      const { data } = await api.post('/albums', {
        name: newAlbumName.trim(),
        description: newAlbumDescription.trim()
      });
      setAlbums([data.album, ...albums]);
      setShowCreateModal(false);
      setNewAlbumName('');
      setNewAlbumDescription('');
      toast.success('Album created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create album');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAlbum = async (e, albumId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this album? Photos will not be deleted.')) return;
    
    try {
      await api.delete(`/albums/${albumId}`);
      setAlbums(albums.filter(a => a._id !== albumId));
      toast.success('Album deleted successfully');
    } catch (error) {
      toast.error('Failed to delete album');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Albums</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          <FolderPlus className="w-5 h-5" />
          <span>Create Album</span>
        </button>
      </div>

      {albums.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album) => (
            <Link key={album._id} to={`/album/${album._id}`} className="group relative rounded-xl overflow-hidden border bg-card hover:border-primary transition-colors block">
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                {album.coverImage ? (
                  <img src={album.coverImage} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground group-hover:bg-primary/5 transition-colors">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-sm">No cover image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-white font-semibold text-lg line-clamp-1">{album.name}</h3>
                  <p className="text-white/80 text-sm">{album.photos?.length || 0} photos</p>
                </div>
                {/* Delete button */}
                <button
                  onClick={(e) => handleDeleteAlbum(e, album._id)}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted rounded-xl border">
          <FolderPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No albums yet</h2>
          <p className="text-muted-foreground mb-6">Group your photos into albums to keep them organized.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Create First Album
          </button>
        </div>
      )}

      {/* Create Album Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Create New Album</h2>
              <button 
                onClick={() => { setShowCreateModal(false); setNewAlbumName(''); setNewAlbumDescription(''); }}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Album Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="e.g., Summer Vacation 2024"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md bg-background min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newAlbumDescription}
                  onChange={(e) => setNewAlbumDescription(e.target.value)}
                  placeholder="What's this album about?"
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setNewAlbumName(''); setNewAlbumDescription(''); }}
                  className="flex-1 px-4 py-2 border rounded-md font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newAlbumName.trim()}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Albums;
