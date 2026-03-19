import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService } from '../services/auth';
import { AuthUser, UserProfile, LoginCredentials, RegisterData, PasswordChangeData } from '../types/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<UserProfile>) => Promise<boolean>;
  changePassword: (passwordData: PasswordChangeData) => Promise<boolean>;
  changeUserPassword: (userId: number, passwordData: { newPassword: string; confirmPassword: string }) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          authService.setupAuth();
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          
          try {
            const userProfile = await authService.getProfile();
            setProfile(userProfile);
          } catch (error) {
            authService.logout();
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      toast.success('Connexion réussie');
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      await authService.register(userData);
      toast.success('Inscription réussie. Vous pouvez maintenant vous connecter.');
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setProfile(null);
    toast.success('Déconnexion réussie');
  };

  const updateProfile = async (userData: Partial<UserProfile>): Promise<boolean> => {
    try {
      const updatedProfile = await authService.updateProfile(userData);
      setProfile(updatedProfile);
      toast.success('Profil mis à jour avec succès');
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };

  const changePassword = async (passwordData: PasswordChangeData): Promise<boolean> => {
    try {
      await authService.changePassword(passwordData);
      toast.success('Mot de passe changé avec succès');
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };

  const changeUserPassword = async (userId: number, passwordData: { newPassword: string; confirmPassword: string }): Promise<boolean> => {
    try {
      await authService.changeUserPassword(userId, passwordData);
      toast.success('Mot de passe utilisateur changé avec succès');
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    changeUserPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};
