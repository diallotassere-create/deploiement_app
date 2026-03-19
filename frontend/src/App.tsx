import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import UserManagementPage from './components/UserManagementPage';
import ProfileForm from './components/ProfileForm';
import { Toaster } from 'react-hot-toast';
import { Users, User, LogOut } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin, logout, loading, login, profile, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onSubmit={async (credentials) => {
      const success = await login(credentials);
      return success;
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Gestion des Utilisateurs
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {profile?.nom} {profile?.prenom}
              </span>
              {isAdmin && (
                <button
                  onClick={() => navigate('/users')}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Users className="w-4 h-4" />
                  Utilisateurs
                </button>
              )}
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <User className="w-4 h-4" />
                Mon Profil
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to={isAdmin ? "/users" : "/profile"} replace />} />
          {isAdmin && (
            <Route path="/users" element={<UserManagementPage />} />
          )}
          <Route path="/profile" element={<ProfileForm 
            profile={profile} 
            onUpdateProfile={async (data) => {
              const success = await updateProfile(data);
              if (success) {
                console.log('Profil mis à jour avec succès');
              }
            }} 
            onChangePassword={async (data) => {
              const success = await changePassword(data);
              if (success) {
                console.log('Mot de passe changé avec succès');
              }
            }} 
          />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
