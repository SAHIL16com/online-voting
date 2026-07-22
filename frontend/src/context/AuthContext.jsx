import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginUser as loginApi, 
  registerUser as registerApi, 
  getCurrentProfile as getProfileApi,
  updateProfileApi,
  uploadAvatarApi
} from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('voting_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('voting_token') || '');
  const [loading, setLoading] = useState(true);

  // Restore user session on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('voting_token');
      if (storedToken) {
        try {
          const profile = await getProfileApi(storedToken);
          if (profile) {
            const userData = { ...profile, token: storedToken };
            setCurrentUser(userData);
            localStorage.setItem('voting_user', JSON.stringify(userData));
          }
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password, role) => {
    const res = await loginApi({ email, password, role });
    if (res && res.token) {
      setToken(res.token);
      setCurrentUser(res);
      localStorage.setItem('voting_token', res.token);
      localStorage.setItem('voting_user', JSON.stringify(res));
      return res;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await registerApi(userData);
    if (res && res.token) {
      setToken(res.token);
      setCurrentUser(res);
      localStorage.setItem('voting_token', res.token);
      localStorage.setItem('voting_user', JSON.stringify(res));
      return res;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const updateProfile = async (profileData) => {
    const currentToken = token || localStorage.getItem('voting_token');
    const updated = await updateProfileApi(profileData, currentToken);
    const newUserData = { ...updated, token: currentToken };
    setCurrentUser(newUserData);
    localStorage.setItem('voting_user', JSON.stringify(newUserData));
    return newUserData;
  };

  const uploadAvatar = async (base64Image) => {
    const currentToken = token || localStorage.getItem('voting_token');
    const updated = await uploadAvatarApi(base64Image, currentToken);
    const newUserData = { ...updated, token: currentToken };
    setCurrentUser(newUserData);
    localStorage.setItem('voting_user', JSON.stringify(newUserData));
    return newUserData;
  };

  const logout = () => {
    setToken('');
    setCurrentUser(null);
    localStorage.removeItem('voting_token');
    localStorage.removeItem('voting_user');
  };

  // Helper structures for components expecting 'user' or 'adminUser'
  const user = currentUser?.role === 'voter' ? {
    name: currentUser.fullName || 'Voter',
    email: currentUser.email,
    role: 'Voter',
    voterId: currentUser.voterId || 'VOT01212347',
    avatar: currentUser.avatar || '/candidate_aman.png',
    phone: currentUser.phone || '+91 98765 12345',
    address: currentUser.address || '456, University Lane, New Delhi'
  } : {
    name: currentUser?.fullName || 'John Doe',
    email: currentUser?.email || 'john@gmail.com',
    role: 'Voter',
    voterId: currentUser?.voterId || 'VOT01212347',
    avatar: currentUser?.avatar || '/candidate_aman.png',
    phone: currentUser?.phone || '+91 98765 12345',
    address: currentUser?.address || '456, University Lane, New Delhi'
  };

  const adminUser = currentUser?.role === 'admin' ? {
    name: currentUser.fullName || 'Admin User',
    email: currentUser.email,
    role: 'Administrator',
    avatar: currentUser.avatar || '/candidate_rahul.png',
    phone: currentUser.phone || '+91 98765 43210',
    address: currentUser.address || '123, Green Street, New Delhi, India'
  } : {
    name: currentUser?.fullName || 'Admin User',
    email: currentUser?.email || 'admin@votesecure.com',
    role: 'Administrator',
    avatar: currentUser?.avatar || '/candidate_rahul.png',
    phone: currentUser?.phone || '+91 98765 43210',
    address: currentUser?.address || '123, Green Street, New Delhi, India'
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        user,
        adminUser,
        login,
        register,
        updateProfile,
        uploadAvatar,
        logout,
        updateUserProfile: updateProfile,
        updateAdminProfile: updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
