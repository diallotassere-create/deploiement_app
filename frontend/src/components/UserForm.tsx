import React from 'react';
import { useForm } from 'react-hook-form';
import { UserFormData, User } from '../types/user';
import { User as UserIcon, X } from 'lucide-react';

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: User;
  isLoading?: boolean;
  onCancel?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  initialData, 
  isLoading = false, 
  onCancel 
}) => {
  // Transformer User en UserFormData pour le formulaire
  const getDefaultValues = (): UserFormData => {
    if (initialData) {
      return {
        nom: initialData.nom,
        prenom: initialData.prenom,
        email: initialData.email,
        telephone: initialData.telephone || '',
        date_naissance: initialData.date_naissance ? 
          new Date(initialData.date_naissance).toISOString().split('T')[0] : '',
        adresse: initialData.adresse || '',
        ville: initialData.ville || '',
        code_postal: initialData.code_postal || '',
        pays: initialData.pays || ''
      };
    }
    return {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      date_naissance: '',
      adresse: '',
      ville: '',
      code_postal: '',
      pays: ''
    };
  };

  const { register, handleSubmit, formState: { errors }, watch } = useForm<UserFormData>({
    defaultValues: getDefaultValues(),
  });

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserIcon className="w-6 h-6" />
          {initialData ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              {...register('nom', { required: 'Le nom est obligatoire' })}
              className="input-field"
              disabled={isLoading}
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              {...register('prenom', { required: 'Le prénom est obligatoire' })}
              className="input-field"
              disabled={isLoading}
            />
            {errors.prenom && (
              <p className="text-red-500 text-sm mt-1">{errors.prenom.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'L\'email est obligatoire',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide'
                }
              })}
              className="input-field"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {!initialData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe *
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: !initialData ? 'Le mot de passe est obligatoire' : false,
                  minLength: {
                    value: 6,
                    message: 'Le mot de passe doit contenir au moins 6 caractères'
                  }
                })}
                className="input-field"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          )}

          {!initialData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmation du mot de passe *
              </label>
              <input
                type="password"
                {...register('confirmPassword', { 
                  required: !initialData ? 'La confirmation du mot de passe est obligatoire' : false,
                  validate: (value) => {
                    if (!value) return true;
                    const password = watch('password');
                    return password === value || 'Les mots de passe ne correspondent pas';
                  }
                })}
                className="input-field"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              {...register('telephone')}
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
              {...register('date_naissance')}
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
              {...register('ville')}
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
              {...register('code_postal')}
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
              {...register('pays')}
              className="input-field"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse
          </label>
          <textarea
            {...register('adresse')}
            rows={3}
            className="input-field resize-none"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3 justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={isLoading}
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'En cours...' : initialData ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
