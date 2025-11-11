import { useState, useEffect } from 'react';
import { Servico, api } from '../services/api';

export function useServicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarServicos = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await api.getServicos();
      setServicos(dados);
    } catch (error) {
      setErro('Erro ao carregar serviços');
      console.error('Erro detalhado:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  return {
    servicos,
    carregando,
    erro,
    recarregar: carregarServicos
  };
}