import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Camera, Save } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profileImage: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data } = await api.put('/users/profile', formData);
      setUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group mb-4">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-md" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-md">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            {user.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              className="w-full px-3 py-2 border rounded-md bg-background min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a little about yourself"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Image URL</label>
            <input
              type="text"
              name="profileImage"
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground mt-1">Enter a direct link to an image to update your avatar.</p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
