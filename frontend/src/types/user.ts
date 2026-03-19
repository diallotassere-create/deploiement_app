export interface User {
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
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  date_naissance?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  password?: string; // Champ pour la création d'utilisateur
  confirmPassword?: string; // Champ de confirmation du mot de passe
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}
