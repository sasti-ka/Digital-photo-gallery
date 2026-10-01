import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import Dashboard from './pages/Dashboard';
import UploadPhoto from './pages/UploadPhoto';
import PhotoDetails from './pages/PhotoDetails';
import Albums from './pages/Albums';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AlbumDetails from './pages/AlbumDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/explore" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/explore" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/explore" /> : <Register />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/explore" element={<Explore />} />
            <Route path="/photo/:id" element={<PhotoDetails />} />
            <Route path="/album/:id" element={<AlbumDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPhoto />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
