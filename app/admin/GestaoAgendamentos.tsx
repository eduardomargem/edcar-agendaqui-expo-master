import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Agendamento, api } from '../../services/api';

// Interface para os parâmetros recebidos
interface GestaoAgendamentoParams {
  agendamentoId: string;
  servico?: string;
  data?: string;
  horario?: string;
  cliente?: string;
  modeloCarro?: string;
  status?: string;
}

// Função para mapear status do backend para a interface
const mapearStatusParaInterface = (status: string): 'PENDENTE' | 'APROVADO' | 'CONCLUIDO' | 'REJEITADO' => {
  switch (status.toLowerCase()) {
    case 'agendado':
      return 'APROVADO';
    case 'confirmado':
      return 'APROVADO';
    case 'concluido':
      return 'CONCLUIDO';
    case 'cancelado':
      return 'REJEITADO';
    default:
      return 'PENDENTE';
  }
};

// Função para mapear status da interface para o backend
const mapearStatusParaBackend = (status: 'PENDENTE' | 'APROVADO' | 'CONCLUIDO' | 'REJEITADO'): string => {
  switch (status) {
    case 'APROVADO':
      return 'confirmado';
    case 'CONCLUIDO':
      return 'concluido';
    case 'REJEITADO':
      return 'cancelado';
    case 'PENDENTE':
    default:
      return 'agendado';
  }
};

export default function GestaoAgendamentos() {
  const router = useRouter();
  const params = useLocalSearchParams<GestaoAgendamentoParams>();
  
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [status, setStatus] = useState<'PENDENTE' | 'APROVADO' | 'CONCLUIDO' | 'REJEITADO'>('PENDENTE');

  const agendamentoId = params.agendamentoId ? parseInt(params.agendamentoId) : null;

  // Carrega os dados do agendamento
  const carregarAgendamento = async () => {
    if (!agendamentoId) {
      Alert.alert('Erro', 'ID do agendamento não encontrado');
      return;
    }

    try {
      setCarregando(true);
      console.log('🔄 Carregando agendamento ID:', agendamentoId);
      
      const dados = await api.getAgendamentoPorId(agendamentoId);
      console.log('✅ Agendamento carregado:', dados);
      
      setAgendamento(dados);
      setStatus(mapearStatusParaInterface(dados.status));
    } catch (error) {
      console.error('❌ Erro ao carregar agendamento:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do agendamento');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarAgendamento();
  }, [agendamentoId]);

  // Atualiza o status do agendamento
  const atualizarStatus = async (novoStatus: typeof status) => {
    if (!agendamentoId) {
      Alert.alert('Erro', 'ID do agendamento não encontrado');
      return;
    }

    try {
      setAtualizando(true);
      console.log('🔄 Atualizando status para:', novoStatus);
      
      const statusBackend = mapearStatusParaBackend(novoStatus);
      const agendamentoAtualizado = await api.atualizarStatusAgendamento(agendamentoId, statusBackend);
      
      console.log('✅ Status atualizado:', agendamentoAtualizado);
      
      setStatus(novoStatus);
      setAgendamento(agendamentoAtualizado);
      
      Alert.alert('Sucesso', `O agendamento foi marcado como ${novoStatus}.`);
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status do agendamento');
    } finally {
      setAtualizando(false);
    }
  };

  // Função para formatar data corrigindo fuso horário
  const formatarData = (dataString: string) => {
    const data = new Date(dataString + 'T12:00:00');
    return data.toLocaleDateString('pt-BR');
  };

  // Função para obter cor do status
  const obterCorStatus = (status: string) => {
    switch (status) {
      case 'PENDENTE': return '#FFA500';
      case 'APROVADO': return '#0B1F44';
      case 'CONCLUIDO': return '#28A745';
      case 'REJEITADO': return '#DC3545';
      default: return '#555';
    }
  };

  if (carregando) {
    return (
      <View style={[estilos.container, estilos.centralizado]}>
        <ActivityIndicator size="large" color="#0B1F44" />
        <Text style={estilos.textoCarregando}>Carregando agendamento...</Text>
      </View>
    );
  }

  if (!agendamento) {
    return (
      <View style={[estilos.container, estilos.centralizado]}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={estilos.textoErro}>Agendamento não encontrado</Text>
        <TouchableOpacity 
          style={estilos.botaoVoltar} 
          onPress={() => router.back()}
        >
          <Text style={estilos.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#0B1F44" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={estilos.scrollContent}>
        <Text style={estilos.titulo}>Gestão de Agendamento</Text>
        <Text style={estilos.subtitulo}>ID: #{agendamento.id}</Text>

        {/* Informações do Agendamento */}
        <View style={estilos.card}>
          <Text style={estilos.cardTitulo}>Informações do Agendamento</Text>
          
          <View style={estilos.infoLinha}>
            <Text style={estilos.infoLabel}>Serviço:</Text>
            <Text style={estilos.infoValor}>{agendamento.servico.nome}</Text>
          </View>
          
          <View style={estilos.infoLinha}>
            <Text style={estilos.infoLabel}>Cliente:</Text>
            <Text style={estilos.infoValor}>{agendamento.cliente.nome}</Text>
          </View>
          
          <View style={estilos.infoLinha}>
            <Text style={estilos.infoLabel}>Data:</Text>
            <Text style={estilos.infoValor}>{formatarData(agendamento.dataAgendamento)}</Text>
          </View>
          
          <View style={estilos.infoLinha}>
            <Text style={estilos.infoLabel}>Horário:</Text>
            <Text style={estilos.infoValor}>{agendamento.horario}</Text>
          </View>
          
          <View style={estilos.infoLinha}>
            <Text style={estilos.infoLabel}>Veículo:</Text>
            <Text style={estilos.infoValor}>{agendamento.modeloCarro}</Text>
          </View>
          
          <View style={estilos.infoLinha}>
            <Text style={estilos.infoLabel}>Status:</Text>
            <Text style={[estilos.status, { color: obterCorStatus(status) }]}>
              {status}
            </Text>
          </View>
        </View>

        {/* Informações do Cliente */}
        <View style={estilos.card}>
          <Text style={estilos.cardTitulo}>Informações do Cliente</Text>
          
          <View style={estilos.infoLinha}>
            <Text style={estilos.infoLabel}>Nome:</Text>
            <Text style={estilos.infoValor}>{agendamento.cliente.nome}</Text>
          </View>
          
          <View style={estilos.infoLinha}>
            <Text style={estilos.infoLabel}>Email:</Text>
            <Text style={estilos.infoValor}>{agendamento.cliente.email}</Text>
          </View>
          
          <View style={estilos.infoLinha}>
            <Text style={estilos.infoLabel}>Telefone:</Text>
            <Text style={estilos.infoValor}>{agendamento.cliente.telefone || 'Não informado'}</Text>
          </View>
        </View>

        {/* Ações de Gestão */}
        <View style={estilos.card}>
          <Text style={estilos.cardTitulo}>Ações de Gestão</Text>
          
          <TouchableOpacity 
            style={[estilos.botaoAcao, { backgroundColor: '#0B1F44' }]} 
            onPress={() => atualizarStatus('APROVADO')}
            disabled={atualizando || status === 'APROVADO'}
          >
            <Text style={estilos.textoBotaoAcao}>
              {atualizando ? 'Atualizando...' : 'Aprovar Agendamento'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[estilos.botaoAcao, { backgroundColor: '#28A745' }]} 
            onPress={() => atualizarStatus('CONCLUIDO')}
            disabled={atualizando || status === 'CONCLUIDO'}
          >
            <Text style={estilos.textoBotaoAcao}>
              {atualizando ? 'Atualizando...' : 'Marcar como Concluído'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[estilos.botaoAcao, { backgroundColor: '#DC3545' }]} 
            onPress={() => atualizarStatus('REJEITADO')}
            disabled={atualizando || status === 'REJEITADO'}
          >
            <Text style={estilos.textoBotaoAcao}>
              {atualizando ? 'Atualizando...' : 'Cancelar Agendamento'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoVoltar: { 
    position: 'absolute', 
    top: 40, 
    left: 20, 
    zIndex: 10 
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 5,
    color: '#0B1F44'
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  textoCarregando: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  textoErro: {
    marginTop: 16,
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  botaoVoltarTexto: {
    marginTop: 20,
    color: '#0B1F44',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0B1F44',
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1F44',
    marginBottom: 12,
  },
  infoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  infoValor: {
    fontSize: 14,
    color: '#555',
    flex: 2,
    textAlign: 'right',
  },
  status: {
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  botaoAcao: { 
    padding: 15, 
    borderRadius: 8, 
    marginVertical: 6,
    alignItems: 'center',
  },
  textoBotaoAcao: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});