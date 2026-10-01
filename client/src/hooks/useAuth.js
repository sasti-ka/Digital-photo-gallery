import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth - Custom hook to access auth context
 * Usage: const { user, login, logout, register, loading } = useAuth();
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
