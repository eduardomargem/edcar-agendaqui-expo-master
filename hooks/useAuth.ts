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
      let erroFinal: string | null = null;

      try {
        // Tentar como Administrador (suprimir erro no console)
        console.log('🔐 Tentando login como administrador...');
        const admin = await api.loginAdministrador(loginRequest);
        usuarioLogado = {
          id: admin.id,
          nome: admin.nome,
          email: admin.email,
          tipo: 'administrador' as TipoUsuario,
          telefone: admin.telefone
        };
        console.log('✅ Login como administrador bem-sucedido');
      } catch (adminError) {
        // Não logar erro no console - é esperado que falhe para não-administradores
        console.log('ℹ️ Não é administrador, tentando como funcionário...');
        
        try {
          // Tentar como Funcionário (suprimir erro no console)
          console.log('🔐 Tentando login como funcionário...');
          const funcionario = await api.loginFuncionario(loginRequest);
          usuarioLogado = {
            id: funcionario.id,
            nome: funcionario.nome,
            email: funcionario.email,
            tipo: 'funcionario' as TipoUsuario,
            telefone: funcionario.telefone
          };
          console.log('✅ Login como funcionário bem-sucedido');
        } catch (funcionarioError) {
          // Não logar erro no console - é esperado que falhe para não-funcionários
          console.log('ℹ️ Não é funcionário, tentando como cliente...');
          
          try {
            // Tentar como Cliente
            console.log('🔐 Tentando login como cliente...');
            const cliente = await api.loginCliente(loginRequest);
            usuarioLogado = {
              id: cliente.id,
              nome: cliente.nome,
              email: cliente.email,
              tipo: 'cliente' as TipoUsuario,
              telefone: cliente.telefone
            };
            console.log('✅ Login como cliente bem-sucedido');
          } catch (clienteError) {
            // Guardar o erro para mostrar ao usuário
            erroFinal = 'Email ou senha inválidos';
            console.error('❌ Falha no login para todos os tipos de usuário');
          }
        }
      }

      if (!usuarioLogado) {
        throw new Error(erroFinal || 'Email ou senha inválidos');
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
  console.log('🚪 Executando logout...');
  Storage.removeItem(USUARIO_STORAGE_KEY);
  setUsuario(null);
  console.log('✅ Logout concluído - usuário removido do storage e estado');
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