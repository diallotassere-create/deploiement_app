import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserProfile, PasswordChangeData } from '../types/auth';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

interface ProfileFormProps {
  profile: UserProfile | null;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
  onChangePassword: (data: PasswordChangeData) => void;
  isLoading?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  profile, 
  onUpdateProfile, 
  onChangePassword, 
  isLoading = false 
}) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors } 
  } = useForm<Partial<UserProfile>>({
    defaultValues: profile || {}
  });

  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors },
    watch: watchPassword
  } = useForm<PasswordChangeData>();

  const newPassword = watchPassword('newPassword');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Formulaire de profil */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
        </div>

        <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                {...registerProfile('nom', { required: 'Le nom est obligatoire' })}
                className="input-field"
                disabled={isLoading}
              />
              {profileErrors.nom && (
                <p className="error-text">{profileErrors.nom.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                {...registerProfile('prenom', { required: 'Le prénom est obligatoire' })}
                className="input-field"
                disabled={isLoading}
              />
              {profileErrors.prenom && (
                <p className="error-text">{profileErrors.prenom.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                className="input-field bg-gray-50"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                {...registerProfile('telephone')}
                className="input-field"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de naissance
              </label>
              <input
                type="date"
                {...registerProfile('date_naissance')}
                className="input-field"
                disabled={isLoading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                {...registerProfile('adresse')}
                className="input-field"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                {...registerProfile('ville')}
                className="input-field"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                {...registerProfile('code_postal')}
                className="input-field"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <input
                type="text"
                {...registerProfile('pays')}
                className="input-field"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Mise à jour...' : 'Mettre à jour le profil'}
          </button>
        </form>
      </div>

      {/* Formulaire de changement de mot de passe */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Sécurité</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="btn-secondary"
          >
            {showPasswordForm ? 'Annuler' : 'Changer le mot de passe'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  {...registerPassword('currentPassword', { 
                    required: 'Le mot de passe actuel est obligatoire' 
                  })}
                  className="input-field pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="error-text">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  {...registerPassword('newPassword', { 
                    required: 'Le nouveau mot de passe est obligatoire',
                    minLength: {
                      value: 6,
                      message: 'Le mot de passe doit contenir au moins 6 caractères'
                    }
                  })}
                  className="input-field pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="error-text">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le nouveau mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...registerPassword('confirmPassword', { 
                    required: 'La confirmation du mot de passe est obligatoire',
                    validate: value => value === newPassword || 'Les mots de passe ne correspondent pas'
                  })}
                  className="input-field pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="error-text">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Changement...' : 'Changer le mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
