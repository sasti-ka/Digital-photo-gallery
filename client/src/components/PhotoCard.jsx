import { Heart, Eye, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mediaUrl, onImgError } from '../utils/helpers';

const PhotoCard = ({ photo }) => {
  const isVideo = photo.fileType === 'video' || (photo.mimeType && photo.mimeType.startsWith('video/'));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative group rounded-xl overflow-hidden mb-4 bg-muted"
    >
      {isVideo ? (
        <video
          src={mediaUrl(photo.imageUrl)}
          className="w-full h-auto object-cover"
          muted
          preload="metadata"
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
        />
      ) : (
        <img
          src={mediaUrl(photo.thumbnailUrl || photo.imageUrl)}
          onError={onImgError}
          alt={photo.title}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Video badge */}
      {isVideo && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white rounded-full text-xs flex items-center space-x-1">
          <Film className="w-3 h-3" />
          <span>Video</span>
        </div>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
        <div className="flex justify-end space-x-2">
          <button className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm text-white transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex justify-between items-end">
          <div className="text-white">
            <h3 className="font-semibold text-lg line-clamp-1">{photo.title}</h3>
            <p className="text-sm opacity-80">{photo.category}</p>
          </div>
          
          <div className="flex space-x-2">
            <Link to={`/photo/${photo._id}`} className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm text-white transition-colors">
              <Eye className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoCard;
