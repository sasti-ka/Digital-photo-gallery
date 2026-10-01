import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, X, Image as ImageIcon, Film } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Nature', 'Travel', 'People', 'Events', 'Food', 'Architecture', 'Animals', 'Other'];

const UploadPhoto = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [tags, setTags] = useState('');
  const [album, setAlbum] = useState('');
  const [albums, setAlbums] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const { data } = await api.get('/albums/my');
        setAlbums(data.albums);
      } catch (error) {
        // Albums fetch is optional, don't show error
      }
    };
    fetchAlbums();
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const isImg = selectedFile.type.startsWith('image/');
      const isVid = selectedFile.type.startsWith('video/');
      
      if (!isImg && !isVid) {
        toast.error('Please select an image or video file');
        return;
      }
      
      const maxSize = isVid ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        toast.error(`File size must be less than ${isVid ? '100MB' : '10MB'}`);
        return;
      }
      
      setFile(selectedFile);
      setIsVideo(isVid);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const isImg = droppedFile.type.startsWith('image/');
      const isVid = droppedFile.type.startsWith('video/');
      if (isImg || isVid) {
        setFile(droppedFile);
        setIsVideo(isVid);
        setPreview(URL.createObjectURL(droppedFile));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a photo or video');
    if (!title) return toast.error('Please enter a title');

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    if (album) {
      formData.append('album', album);
    }

    try {
      await api.post('/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`${isVideo ? 'Video' : 'Photo'} uploaded successfully!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Upload Photo / Video</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: File Upload */}
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-xl overflow-hidden aspect-[4/5] flex flex-col items-center justify-center relative transition-colors ${
              preview ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            {preview ? (
              <>
                {isVideo ? (
                  <video src={preview} controls className="w-full h-full object-contain bg-black" />
                ) : (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                    setIsVideo(false);
                  }}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                {isVideo && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 text-white rounded-full text-sm flex items-center space-x-1">
                    <Film className="w-4 h-4" />
                    <span>Video</span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-6 cursor-pointer">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">Images: JPG, PNG, WEBP (max. 10MB)</p>
                <p className="text-sm text-muted-foreground">Videos: MP4, WEBM, MOV (max. 100MB)</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg,video/quicktime"
              className="hidden"
            />
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md bg-background"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your photo a title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md bg-background min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell the story behind this photo..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-background"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Album (optional)</label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-background"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
            >
              <option value="">No album</option>
              {albums.map(a => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md bg-background"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="nature, sunset, beautiful"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full h-12 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload {isVideo ? 'Video' : 'Photo'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPhoto;
