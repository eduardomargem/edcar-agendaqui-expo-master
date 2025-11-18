// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { Cliente, LoginRequest, Administrador, Funcionario, UsuarioLogado, TipoUsuario, api } from '../services/api';

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

const USUARIO_STORAGE_KEY = '@usuario_data';

export function useAuth() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Carregar dados do usuário ao iniciar o app
  useEffect(() => {
    carregarUsuarioStorage();
  }, []);

  const carregarUsuarioStorage = async () => {
    try {
      const usuarioData = Storage.getItem(USUARIO_STORAGE_KEY);
      if (usuarioData) {
        setUsuario(JSON.parse(usuarioData));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email: string, senha: string): Promise<UsuarioLogado> => {
    try {
      setCarregando(true);
      const loginRequest: LoginRequest = { email, senha };

      // Tentar login em ordem: Administrador -> Funcionário -> Cliente
      let usuarioLogado: UsuarioLogado | null = null;

      try {
        // Tentar como Administrador
        const admin = await api.loginAdministrador(loginRequest);
        usuarioLogado = {
          id: admin.id,
          nome: admin.nome,
          email: admin.email,
          tipo: 'administrador' as TipoUsuario,
          telefone: admin.telefone
        };
      } catch (adminError) {
        try {
          // Tentar como Funcionário
          const funcionario = await api.loginFuncionario(loginRequest);
          usuarioLogado = {
            id: funcionario.id,
            nome: funcionario.nome,
            email: funcionario.email,
            tipo: 'funcionario' as TipoUsuario,
            telefone: funcionario.telefone
          };
        } catch (funcionarioError) {
          try {
            // Tentar como Cliente
            const cliente = await api.loginCliente(loginRequest);
            usuarioLogado = {
              id: cliente.id,
              nome: cliente.nome,
              email: cliente.email,
              tipo: 'cliente' as TipoUsuario,
              telefone: cliente.telefone
            };
          } catch (clienteError) {
            throw new Error('Email ou senha inválidos para nenhum tipo de usuário');
          }
        }
      }

      if (!usuarioLogado) {
        throw new Error('Erro no processo de login');
      }

      setUsuario(usuarioLogado);
      Storage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuarioLogado));
      
      return usuarioLogado;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const logout = () => {
    Storage.removeItem(USUARIO_STORAGE_KEY);
    setUsuario(null);
  };

  // Função para obter o ID do usuário logado
  const getUsuarioId = (): number | null => {
    return usuario?.id || null;
  };

  // Funções auxiliares para verificar tipo de usuário
  const isAdministrador = (): boolean => usuario?.tipo === 'administrador';
  const isFuncionario = (): boolean => usuario?.tipo === 'funcionario';
  const isCliente = (): boolean => usuario?.tipo === 'cliente';

  return {
    usuario,
    carregando,
    login,
    logout,
    getUsuarioId,
    isAdministrador,
    isFuncionario,
    isCliente,
    estaLogado: !!usuario,
  };
}