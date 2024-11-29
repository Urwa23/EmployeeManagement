import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Authentication Context
export const AuthContext = createContext();

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  // Safely handle localStorage by checking if the 'user' key exists
  const storedUser = localStorage.getItem('user');
  const [currentUser, setCurrentUser] = useState(
    storedUser ? JSON.parse(storedUser) : null  // Only parse if storedUser exists
  );

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user in localStorage
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user'); // Remove user data from localStorage
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Authentication Context
export const useAuth = () => useContext(AuthContext);
