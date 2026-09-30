import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface RegisterData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password?: string) => boolean;
  register: (data: RegisterData) => User;
  switchUser: (userId: string) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  logout: () => void;
  getUserById: (id: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'nexustrack_users_v1';
const CURRENT_USER_STORAGE_KEY = 'nexustrack_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stored users:', e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse current user:', e);
      }
    }
    // Default to the first user (Alex Vance - Tech Lead)
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (email: string, password?: string): boolean => {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (foundUser) {
      if (password && foundUser.password && foundUser.password !== password) {
        return false;
      }
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (data: RegisterData): User => {
    const initials = data.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password || 'password123',
      role: data.role,
      department: data.department || 'Engineering',
      avatar:
        data.avatar ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      initials: initials || 'EX',
      color: randomColor,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const getUserById = (id: string): User | undefined => {
    return users.find((u) => u.id === id);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        switchUser,
        updateProfile,
        logout,
        getUserById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
