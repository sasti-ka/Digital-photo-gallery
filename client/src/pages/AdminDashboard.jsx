import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { Users, Image as ImageIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { mediaUrl, onImgError } from '../utils/helpers';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, photosRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/photos')
        ]);
        setUsers(usersRes.data.users);
        setPhotos(photosRes.data.photos);
      } catch (error) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await api.delete(`/admin/photos/${id}`);
      setPhotos(photos.filter(p => p._id !== id));
      toast.success('Photo deleted');
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" />;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-muted-foreground font-medium">Total Users</p>
            <h2 className="text-3xl font-bold">{users.length}</h2>
          </div>
          <Users className="w-10 h-10 text-primary opacity-50" />
        </div>
        <div className="bg-card border rounded-xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-muted-foreground font-medium">Total Photos</p>
            <h2 className="text-3xl font-bold">{photos.length}</h2>
          </div>
          <ImageIcon className="w-10 h-10 text-primary opacity-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">User Management</h2>
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {users.map(u => (
                <div key={u._id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {u.role}
                    </span>
                  </div>
                  {u.role !== 'admin' && (
                    <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Photos Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Photo Management</h2>
          <div className="grid grid-cols-2 gap-4">
            {photos.slice(0, 8).map(photo => (
              <div key={photo._id} className="relative group rounded-lg overflow-hidden border bg-muted">
                <img src={mediaUrl(photo.thumbnailUrl || photo.imageUrl)} onError={onImgError} alt={photo.title} className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleDeletePhoto(photo._id)} className="p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
