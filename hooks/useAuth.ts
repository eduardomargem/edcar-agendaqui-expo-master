// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { Cliente, LoginRequest, api } from '../services/api';

// Storage simples compatível com navegador
const Storage = {
  setItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },

  getItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  },

  removeItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }
};

const CLIENTE_STORAGE_KEY = '@cliente_data';

export function useAuth() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Carregar dados do cliente ao iniciar o app
  useEffect(() => {
    carregarClienteStorage();
  }, []);

  const carregarClienteStorage = async () => {
    try {
      const clienteData = Storage.getItem(CLIENTE_STORAGE_KEY);
      if (clienteData) {
        setCliente(JSON.parse(clienteData));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
    } finally {
      setCarregando(false);
    }
  };

  const login = async (loginRequest: LoginRequest): Promise<Cliente> => {
    try {
      setCarregando(true);
      
      // Fazer autenticação no backend
      const clienteLogado = await api.loginCliente(loginRequest);
      
      // Salvar apenas informações básicas no storage
      const clienteParaStorage = {
        id: clienteLogado.id,
        nome: clienteLogado.nome,
        email: clienteLogado.email,
        telefone: clienteLogado.telefone
      };
      
      setCliente(clienteLogado);
      Storage.setItem(CLIENTE_STORAGE_KEY, JSON.stringify(clienteParaStorage));
      
      return clienteLogado;
    } catch (error) {
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const logout = () => {
    Storage.removeItem(CLIENTE_STORAGE_KEY);
    setCliente(null);
  };

  // Função para obter o ID do cliente logado (útil para inserções no banco)
  const getClienteId = (): number | null => {
    return cliente?.id || null;
  };

  return {
    cliente,
    carregando,
    login,
    logout,
    getClienteId,
    estaLogado: !!cliente,
  };
}