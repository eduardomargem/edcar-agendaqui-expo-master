const API_BASE_URL = 'http://10.135.145.26:8080/api'; // Altere para sua URL

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  duracao_min: number;
  preco: number;
  ativo: boolean;
}

export const api = {
  async getServicos(): Promise<Servico[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/servicos`);
      if (!response.ok) {
        throw new Error('Erro ao buscar serviços');
      }
      return await response.json();
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
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }
};