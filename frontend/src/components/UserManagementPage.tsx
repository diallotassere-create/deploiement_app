import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import UserList from './UserList';
import UserForm from './UserForm';
import PasswordChangeForm from './PasswordChangeForm';
import { User, UserFormData } from '../types/user';
import { Plus, Users } from 'lucide-react';

const UserManagementPage: React.FC = () => {
  const { users, loading, createUser, updateUser, deleteUser, fetchUsers } = useUsers();
  const { changeUserPassword } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);

  const handleCreateUser = async (data: UserFormData) => {
    const newUser = await createUser(data);
    if (newUser) {
      setShowForm(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (editingUser) {
      const updatedUser = await updateUser(editingUser.id, data);
      if (updatedUser) {
        setShowForm(false);
        setEditingUser(null);
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      const success = await deleteUser(id);
      if (success) {
        fetchUsers();
      }
    }
  };

  const handleChangePassword = (user: User) => {
    setPasswordUser(user);
    setShowPasswordForm(true);
  };

  const handlePasswordChange = async (userId: number, passwordData: { currentPassword: string; newPassword: string }) => {
    const success = await changeUserPassword(userId, {
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.newPassword
    });
    if (success) {
      setShowPasswordForm(false);
      setPasswordUser(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handlePasswordCancel = () => {
    setShowPasswordForm(false);
    setPasswordUser(null);
  };

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            Retour à la liste
          </button>
        </div>
        <UserForm
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          initialData={editingUser || undefined}
          isLoading={loading}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (showPasswordForm && passwordUser) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handlePasswordCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            Retour à la liste
          </button>
        </div>
        <PasswordChangeForm
          user={passwordUser}
          onSubmit={handlePasswordChange}
          onCancel={handlePasswordCancel}
          isLoading={loading}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel Utilisateur
        </button>
      </div>
      
      <UserList
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onChangePassword={handleChangePassword}
        isLoading={loading}
      />
    </div>
  );
};

export default UserManagementPage;
