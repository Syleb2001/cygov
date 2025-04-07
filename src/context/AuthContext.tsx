import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  impersonatedUser: Omit<User, 'password'> | null;
  login: (email: string, password: string) => Promise<any>;
  setUserAndRedirect: (user: Omit<User, 'password'>) => void;
  updateUser: (user: Omit<User, 'password'>) => void;
  logout: () => void;
  loading: boolean;
  showSuccessMessage: boolean;
  impersonateUser: (user: Omit<User, 'password'>) => void;
  stopImpersonating: () => void;
  isReadOnly: boolean;
  setIsReadOnly: (value: boolean) => void;
  realUser: Omit<User, 'password'> | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<Omit<User, 'password'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedImpersonatedUser = sessionStorage.getItem('impersonatedUser');
    const storedIsReadOnly = sessionStorage.getItem('isReadOnly');

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Check if user has read-only flag in localStorage
        const userReadOnly = localStorage.getItem(`readOnly_${userData.id}`);
        if (userReadOnly) {
          setIsReadOnly(JSON.parse(userReadOnly));
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        sessionStorage.removeItem('user');
      }
    }

    if (storedImpersonatedUser) {
      try {
        setImpersonatedUser(JSON.parse(storedImpersonatedUser));
      } catch (error) {
        console.error('Error parsing stored impersonated user:', error);
        sessionStorage.removeItem('impersonatedUser');
      }
    }

    if (storedIsReadOnly) {
      setIsReadOnly(JSON.parse(storedIsReadOnly));
    }

    setLoading(false);
  }, []);

  const setUserAndRedirect = (userData: Omit<User, 'password'>) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
    
    // Check if user has read-only flag in localStorage
    const userReadOnly = localStorage.getItem(`readOnly_${userData.id}`);
    if (userReadOnly) {
      setIsReadOnly(JSON.parse(userReadOnly));
    }
    
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      navigate('/');
    }, 2000);
  };

  const updateUser = (userData: Omit<User, 'password'>) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const impersonateUser = (userData: Omit<User, 'password'>) => {
    setImpersonatedUser(userData);
    sessionStorage.setItem('impersonatedUser', JSON.stringify(userData));
    
    // If real user is admin, don't set read-only mode
    if (!user?.isAdmin) {
      setIsReadOnly(true);
      sessionStorage.setItem('isReadOnly', 'true');
    }
    
    navigate('/');
  };

  const stopImpersonating = () => {
    setImpersonatedUser(null);
    setIsReadOnly(false);
    sessionStorage.removeItem('impersonatedUser');
    sessionStorage.removeItem('isReadOnly');
    navigate('/admin');
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.requiresTwoFactor) {
        return data;
      }

      // Check if user has read-only flag in localStorage
      const userReadOnly = localStorage.getItem(`readOnly_${data.user.id}`);
      if (userReadOnly) {
        setIsReadOnly(JSON.parse(userReadOnly));
      }

      setUserAndRedirect(data.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    const userId = user?.id;
    setUser(null);
    setImpersonatedUser(null);
    setIsReadOnly(false);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('impersonatedUser');
    sessionStorage.removeItem('isReadOnly');
    navigate('/auth');
  };

  // Update isReadOnly setter to also store in localStorage
  const handleSetIsReadOnly = (value: boolean) => {
    // If real user is admin, never set to read-only
    if (user?.isAdmin) {
      value = false;
    }
    
    setIsReadOnly(value);
    sessionStorage.setItem('isReadOnly', JSON.stringify(value));
    
    // If we're setting read-only for a real user (not impersonating)
    if (user && !impersonatedUser) {
      localStorage.setItem(`readOnly_${user.id}`, JSON.stringify(value));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user: impersonatedUser || user, 
      impersonatedUser,
      login, 
      setUserAndRedirect, 
      updateUser, 
      logout, 
      loading, 
      showSuccessMessage,
      impersonateUser,
      stopImpersonating,
      isReadOnly,
      setIsReadOnly: handleSetIsReadOnly,
      realUser: user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}