const API_BASE_URL = 'http://10.135.110.39:8080/api';

export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  dataCadastro: string;
  cpf: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface VerificarEmailRequest {
  email: string;
}

export interface VerificarCpfRequest {
  cpf: string;
}

export interface Servico {
  id: number;
  nome: string;
  descricao?: string;
  duracaoMin: number;
  preco: number;
  ativo: boolean;
  itensInclusos?: string[];
}

export interface Funcionario {
  id: number;
  cpf: string;
  dataCadastro: string;
  email: string;
  nome: string;
  senha: string;
  telefone: string;
  ativo: boolean;
}

export const api = {
  async loginCliente(loginRequest: LoginRequest): Promise<Cliente> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
      });
      
      if (response.status === 401) {
        throw new Error('Email ou senha inválidos');
      }
      
      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  // Verificar se email existe
  async verificarEmail(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/verificar-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error('Erro ao verificar email');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  async getServicos(): Promise<Servico[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/servicos`);
      if (!response.ok) {
        throw new Error('Erro ao buscar serviços');
      }
      const data = await response.json();
      
      // Mapeie os dados para corresponder à interface
      return data.map((servico: any) => ({
        id: servico.id,
        nome: servico.nome,
        descricao: servico.descricao,
        duracaoMin: servico.duracaoMin,
        preco: servico.preco,
        ativo: servico.ativo
      }));
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  async getServicoById(id: number): Promise<Servico> {
    try {
      const response = await fetch(`${API_BASE_URL}/servicos/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar serviço');
      }
      const servico = await response.json();
      
      return {
        id: servico.id,
        nome: servico.nome,
        descricao: servico.descricao,
        duracaoMin: servico.duracaoMin,
        preco: servico.preco,
        ativo: servico.ativo,
      };
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }
};