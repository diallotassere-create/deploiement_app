import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse, UserProfile, PasswordChangeData } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configuration d'axios avec le token
const configureAxios = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Appeler cette fonction au démarrage
configureAxios();

export const authService = {
  // Inscription
  async register(userData: RegisterData): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de l\'inscription');
    }
  },

  // Connexion
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      // Stocker le token et l'utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configurer axios pour les futures requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la connexion');
    }
  },

  // Déconnexion
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  },

  // Vérifier le token
  async verifyToken(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`);
      return response.data;
    } catch (error: any) {
      // Si le token est invalide, déconnecter l'utilisateur
      this.logout();
      throw new Error('Token invalide');
    }
  },

  // Obtenir le profil
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await axios.get(`${API_URL}/profile/me`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération du profil');
    }
  },

  // Mettre à jour le profil
  async updateProfile(userData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await axios.put(`${API_URL}/profile/me`, userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour du profil');
    }
  },

  // Changer le mot de passe
  async changePassword(passwordData: PasswordChangeData): Promise<any> {
    try {
      const response = await axios.put(`${API_URL}/profile/me/password`, passwordData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors du changement de mot de passe');
    }
  },

  // Changer le mot de passe d'un utilisateur (admin uniquement)
  async changeUserPassword(userId: number, passwordData: { newPassword: string; confirmPassword: string }): Promise<any> {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}/password`, passwordData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors du changement de mot de passe');
    }
  },

  // Obtenir l'utilisateur actuel depuis localStorage
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  // Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },

  // Configurer axios avec le token stocké
  setupAuth(): void {
    configureAxios();
  }
};
