import React from 'react';
import { User } from '../types/user';
import { Edit, Trash2, Mail, Phone, Calendar, MapPin, Key } from 'lucide-react';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onChangePassword?: (user: User) => void;
  isLoading?: boolean;
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  onEdit, 
  onDelete, 
  onChangePassword,
  isLoading = false 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Aucun utilisateur trouvé</div>
        <p className="text-gray-400 mt-2">Commencez par ajouter un nouvel utilisateur</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Téléphone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Localisation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date de création
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {user.prenom} {user.nom}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {user.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  {user.telephone ? (
                    <>
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {user.telephone}
                    </>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  {user.ville ? (
                    <>
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {user.ville}
                      {user.pays && `, ${user.pays}`}
                    </>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {formatDate(user.created_at)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {onChangePassword && (
                    <button
                      onClick={() => onChangePassword(user)}
                      className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                      title="Changer le mot de passe"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(user.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
