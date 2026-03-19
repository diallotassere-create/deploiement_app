import { useState, useEffect } from 'react';
import { User, UserFormData } from '../types/user';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification requis');
      }
      
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }
      
      const data = await response.json();
      setUsers(data.data || []);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs';
      setError(message);
      if (toast.error) toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: UserFormData): Promise<User | null> => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification requis');
      }
      
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création');
      }
      
      const data = await response.json();
      const newUser = data.data;
      setUsers((prev: User[]) => [newUser, ...prev]);
      if (toast.success) toast.success('Utilisateur créé avec succès');
      return newUser;
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création';
      if (toast.error) toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, userData: UserFormData): Promise<User | null> => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification requis');
      }
      
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }
      
      const data = await response.json();
      const updatedUser = data.data;
      setUsers((prev: User[]) => prev.map((user: User) => user.id === id ? updatedUser : user));
      if (toast.success) toast.success('Utilisateur mis à jour avec succès');
      return updatedUser;
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      if (toast.error) toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification requis');
      }
      
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }
      
      setUsers((prev: User[]) => prev.filter((user: User) => user.id !== id));
      if (toast.success) toast.success('Utilisateur supprimé avec succès');
      return true;
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      if (toast.error) toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
