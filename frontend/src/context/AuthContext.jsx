import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@gmail.com',
    role: 'Voter',
    voterId: 'VOT01212347',
    avatar: '/candidate_aman.png',
    phone: '+91 98765 12345',
    address: '456, University Lane, New Delhi'
  });

  const [adminUser, setAdminUser] = useState({
    name: 'Admin User',
    email: 'admin@votesecure.com',
    role: 'Administrator',
    avatar: '/candidate_rahul.png',
    phone: '+91 98765 43210',
    address: '123, Green Street, New Delhi, India'
  });

  const updateUserProfile = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const updateAdminProfile = (updatedData) => {
    setAdminUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        updateUserProfile,
        updateAdminProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
