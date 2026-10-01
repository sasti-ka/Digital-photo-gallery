import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Heart, Download, Share2, ArrowLeft, Eye, Calendar, User as UserIcon, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { mediaUrl, onImgError } from '../utils/helpers';

const PhotoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const { data } = await api.get(`/photos/${id}`);
        setPhoto(data.photo);
      } catch (error) {
        toast.error('Photo not found');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhoto();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like photos');
    try {
      const { data } = await api.post(`/photos/${id}/like`);
      setPhoto({ ...photo, likes: data.likes });
    } catch (error) {
      toast.error('Failed to like photo');
    }
  };

  const handleFavorite = async () => {
    if (!user) return toast.error('Please login to favorite photos');
    try {
      await api.post(`/photos/${id}/favorite`);
      toast.success('Added to favorites!');
    } catch (error) {
      toast.error('Failed to favorite photo');
    }
  };

  const handleDownload = () => {
    if (!photo) return;
    const link = document.createElement('a');
    link.href = mediaUrl(photo.imageUrl);
    // Extract filename from URL or use original filename
    const filename = photo.originalFilename || photo.imageUrl.split('/').pop() || `${photo.title}`;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!photo) return null;

  const isLiked = user && photo.likes.includes(user._id);
  const isVideo = photo.fileType === 'video' || (photo.mimeType && photo.mimeType.startsWith('video/'));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="bg-card rounded-2xl overflow-hidden border shadow-sm flex flex-col md:flex-row">
        {/* Left side: Media */}
        <div className="md:w-2/3 bg-black flex items-center justify-center min-h-[500px] relative">
          {isVideo ? (
            <video 
              src={mediaUrl(photo.imageUrl)} 
              className="w-full h-full object-contain max-h-[80vh]"
              controls
              autoPlay
            />
          ) : (
            <img 
              src={mediaUrl(photo.imageUrl)} 
              onError={onImgError}
              alt={photo.title} 
              className="w-full h-full object-contain max-h-[80vh] cursor-pointer"
              onClick={() => setIsFullscreen(!isFullscreen)}
            />
          )}
          
          {isVideo && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white rounded-full text-sm flex items-center space-x-1 z-10">
              <Film className="w-4 h-4" />
              <span>Video</span>
            </div>
          )}
        </div>

        {/* Right side: Details */}
        <div className="md:w-1/3 p-6 flex flex-col space-y-6">
          <div className="flex items-center space-x-3">
            {photo.user.profileImage ? (
              <img src={photo.user.profileImage} alt={photo.user.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-medium text-lg leading-tight">{photo.user.name}</p>
              <p className="text-sm text-muted-foreground">Creator</p>
            </div>
          </div>

          <hr className="border-border" />

          <div>
            <h1 className="text-2xl font-bold mb-2">{photo.title}</h1>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {photo.description || 'No description provided.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {photo.category}
            </span>
            {photo.tags && photo.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{photo.views} views</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(photo.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto pt-6">
            <button 
              onClick={handleLike}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg border transition-colors ${
                isLiked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-background hover:bg-muted'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{photo.likes.length} Likes</span>
            </button>
            
            <button 
              onClick={handleFavorite}
              className="flex items-center justify-center space-x-2 py-2.5 rounded-lg border bg-background hover:bg-muted transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>Favorite</span>
            </button>

            <button 
              onClick={handleDownload}
              className="flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors col-span-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Media</span>
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center justify-center space-x-2 py-2.5 rounded-lg border bg-background hover:bg-muted transition-colors col-span-2"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetails;
