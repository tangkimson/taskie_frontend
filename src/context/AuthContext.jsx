// Auth Context
// Provides authentication state and functions throughout the app

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (emailOrPhone, password) => {
    try {
      const response = await api.post('/auth/login', {
        emailOrPhone,
        password
      });

      if (response.data.success) {
        const { token, ...userData } = response.data.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        // Handle case where response doesn't have success flag
        return {
          success: false,
          message: response.data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle network errors or other errors
      if (!error.response) {
        return {
          success: false,
          message: 'Unable to connect to server. Please check your network connection and try again.'
        };
      }
      // Return the error message from backend (now in Vietnamese)
      return {
        success: false,
        message: error.response?.data?.message || 'Incorrect email/phone number or password'
      };
    }
  };

  // Register function
  const register = async (formData) => {
    try {
      const response = await api.post('/auth/register', formData);

      if (response.data.success) {
        const { token, ...userData } = response.data.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        // Handle case where response doesn't have success flag
        return {
          success: false,
          message: response.data.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Switch role function
  const switchRole = async (role) => {
    try {
      const response = await api.put('/auth/role', { role });

      if (response.data.success) {
        const updatedUser = { ...user, currentRole: role };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
    } catch (error) {
      console.error('Switch role error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to switch role'
      };
    }
  };

  // Update user in state and localStorage
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    switchRole,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

