// src/hooks/useAuth.js
// Hook para manejo de autenticación

import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('ugel_token'));

  useEffect(() => {
    // Verificar sesión al cargar
    const initAuth = async () => {
      const savedToken = localStorage.getItem('ugel_token');
      const savedUser = localStorage.getItem('ugel_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verificar token con el servidor
          const response = await authService.getMe();
          setUser(response.data.usuario);
        } catch {
          // Token inválido, limpiar
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { token: newToken, usuario } = response.data;

    localStorage.setItem('ugel_token', newToken);
    localStorage.setItem('ugel_user', JSON.stringify(usuario));

    setToken(newToken);
    setUser(usuario);

    return usuario;
  };

  const logout = () => {
    localStorage.removeItem('ugel_token');
    localStorage.removeItem('ugel_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => user?.rol === 'ADMIN';
  const isOperador = () => user?.rol === 'OPERADOR' || user?.rol === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isAdmin,
      isOperador,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
