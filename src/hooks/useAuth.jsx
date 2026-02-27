// src/hooks/useAuth.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/api/entities';
import { toast } from 'sonner';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega usuário ao iniciar (persistência de sessão)
  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await User.me();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  // --- FUNÇÃO UNIFICADA (Handler Central) ---
  // Esta função aceita o objeto enviado pelo LoginModal
  const handleAuth = async ({ email, password, full_name, isRegister, plan }) => {
    try {
      let data;
      
      if (isRegister) {
        // Fluxo de Registro: Passa o 'plan' para a API
        data = await User.register({ 
            email, 
            password, 
            full_name, 
            plan // 👈 CRÍTICO: Envia o plano selecionado (BETA, ADMIN, etc)
        });
        toast.success("Boas-vindas ao Prana.");
      } else {
        // Fluxo de Login
        data = await User.login({ email, password });
        toast.success("Conexão restabelecida.");
      }

      setUser(data);
      return data;
    } catch (error) {
      console.error("Falha na autenticação:", error);
      // O erro é relançado para que o Modal exiba a mensagem vermelha
      throw error; 
    }
  };

  const logout = () => {
    User.logout();
    setUser(null);
    toast.info("Sessão encerrada.");
  };

  // Funções auxiliares para atualização de estado local (ex: gastou créditos)
  const updateUserCredits = (newCredits) => {
    setUser(prev => prev ? { ...prev, credits: newCredits } : null);
  };

  const value = {
    user,
    isLoading,
    login: handleAuth, // Exportamos como 'login' para manter compatibilidade com o Modal
    logout,
    updateUserCredits
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};