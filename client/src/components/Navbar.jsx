import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Camera, LogOut, Menu, X, User as UserIcon, Sun, Moon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b bg-card text-card-foreground">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">PhotoVault</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-sm font-medium hover:text-primary transition-colors">Explore</Link>
            {user && (
              <>
                <Link to="/albums" className="text-sm font-medium hover:text-primary transition-colors">Albums</Link>
                <Link to="/favorites" className="text-sm font-medium hover:text-primary transition-colors">Favorites</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors text-red-500">Admin</Link>
                )}
                <Link to="/upload" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                  Upload
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="text-sm font-medium px-4 py-2 hover:bg-accent rounded-md transition-colors">Login</Link>
                <Link to="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/explore" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">Explore</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">Dashboard</Link>
                <Link to="/albums" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">Albums</Link>
                <Link to="/favorites" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">Favorites</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent text-red-500">Admin Dashboard</Link>
                )}
                <Link to="/upload" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-accent">Upload</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-accent">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-accent">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
