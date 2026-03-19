export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
  date_naissance?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export interface UserProfile {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  date_naissance?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'user';
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
