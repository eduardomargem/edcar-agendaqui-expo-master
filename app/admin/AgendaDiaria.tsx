import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Agendamento, api } from '../../services/api';

// Interface atualizada para refletir os dados do backend
interface AgendamentoBackend {
  id: number;
  servico: {
    nome: string;
  };
  cliente: {
    nome: string;
  };
  modeloCarro: string;
  dataAgendamento: string;
  horario: string;
  status: string;
}

export default function AgendaDiaria() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<AgendamentoBackend[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [dataAtual, setDataAtual] = useState<string>('');

  // Função para formatar a data atual no formato YYYY-MM-DD (mais robusta)
  const obterDataAtual = () => {
    // Usa toLocaleDateString com timezone para garantir a data correta
    const hoje = new Date();
    const offset = hoje.getTimezoneOffset();
    const dataLocal = new Date(hoje.getTime() - (offset * 60 * 1000));
    
    return dataLocal.toISOString().split('T')[0];
  };

  // Define a data atual quando o componente monta
  useEffect(() => {
    const dataHoje = obterDataAtual();
    setDataAtual(dataHoje);
    console.log('🗓️ Data definida:', dataHoje);
  }, []);

  const carregarAgendamentos = useCallback(async () => {
    try {
      setCarregando(true);
      
      // Usa a data atual ou uma data específica se necessário
      const dataParaBuscar = dataAtual || obterDataAtual();
      console.log('📅 Buscando agendamentos para data:', dataParaBuscar);
      
      const dados = await api.getAgendamentosPorData(dataParaBuscar);
      console.log('✅ Agendamentos carregados:', dados.length);
      
      setAgendamentos(dados);
    } catch (error) {
      console.error('❌ Erro ao carregar agendamentos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os agendamentos do dia');
    } finally {
      setCarregando(false);
    }
  }, [dataAtual]);

  useEffect(() => {
    if (dataAtual) {
      carregarAgendamentos();
    }
  }, [dataAtual, carregarAgendamentos]);

  // Função para mapear os status do backend para os status da interface
  const mapearStatus = (status: string): 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO' => {
    switch (status.toLowerCase()) {
      case 'agendado':
        return 'CONFIRMADO';
      case 'confirmado':
        return 'CONFIRMADO';
      case 'concluido':
        return 'CONCLUIDO';
      case 'cancelado':
        return 'CANCELADO';
      default:
        return 'PENDENTE';
    }
  };

  const statusCor = (status: string) => {
    const statusMapeado = mapearStatus(status);
    
    switch (statusMapeado) {
      case 'PENDENTE': return '#FFA500';
      case 'CONFIRMADO': return '#0B1F44';
      case 'CONCLUIDO': return '#28A745';
      case 'CANCELADO': return '#DC3545';
      default: return '#555';
    }
  };

  // CORREÇÃO: Funções de formatação de data corrigidas
  const formatarDataExibicao = (dataString: string) => {
    // Adiciona o horário para evitar problemas de fuso horário
    const data = new Date(dataString + 'T12:00:00');
    return data.toLocaleDateString('pt-BR');
  };

  const formatarDataParaTitulo = (dataString: string) => {
    // Adiciona o horário para evitar problemas de fuso horário
    const data = new Date(dataString + 'T12:00:00');
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    const dataFormatada = data.toLocaleDateString('pt-BR', options);
    console.log('📝 Formatando título:', { dataString, dataFormatada });
    
    return dataFormatada;
  };

  // Função para debug - mostra informações sobre a data atual
  const debugDataAtual = () => {
    if (dataAtual) {
      const hoje = new Date();
      const dataTitulo = formatarDataParaTitulo(dataAtual);
      
      console.log('🔍 DEBUG DATA ATUAL:');
      console.log('Data do sistema:', hoje.toString());
      console.log('Data atual (state):', dataAtual);
      console.log('Título formatado:', dataTitulo);
      console.log('---');
    }
  };

  // Executa o debug quando a data atual muda
  useEffect(() => {
    debugDataAtual();
  }, [dataAtual]);

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#0B1F44" />
      </TouchableOpacity>

      <Text style={estilos.titulo}>
        Agenda do Dia
      </Text>
      <Text style={estilos.subtitulo}>
        {dataAtual ? formatarDataParaTitulo(dataAtual) : 'Carregando...'}
      </Text>

      {/* Botão de debug temporário - pode remover depois */}
      <TouchableOpacity 
        style={estilos.botaoDebug} 
        onPress={debugDataAtual}
      >
      </TouchableOpacity>

      {carregando ? (
        <View style={estilos.centralizado}>
          <ActivityIndicator size="large" color="#0B1F44" />
          <Text style={estilos.textoCarregando}>Carregando agendamentos...</Text>
        </View>
      ) : agendamentos.length === 0 ? (
        <View style={estilos.centralizado}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={estilos.textoVazio}>Nenhum agendamento para hoje</Text>
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl 
              refreshing={carregando} 
              onRefresh={carregarAgendamentos} 
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[estilos.card, { borderLeftColor: statusCor(item.status) }]}
              onPress={() => router.push({ 
                pathname: '/admin/GestaoAgendamentos', 
                params: { 
                  agendamentoId: item.id.toString(),
                  servico: item.servico.nome,
                  data: item.dataAgendamento,
                  horario: item.horario,
                  cliente: item.cliente.nome,
                  modeloCarro: item.modeloCarro,
                  status: item.status
                } 
              })}
            >
              <View style={estilos.cabecalhoCard}>
                <Text style={estilos.textoPrincipal}>{item.servico.nome}</Text>
                <Text style={[estilos.status, { color: statusCor(item.status) }]}>
                  {mapearStatus(item.status)}
                </Text>
              </View>
              
              <Text style={estilos.textoSecundario}>
                <Text style={estilos.label}>Cliente:</Text> {item.cliente.nome}
              </Text>
              <Text style={estilos.textoSecundario}>
                <Text style={estilos.label}>Horário:</Text> {item.horario}
              </Text>
              <Text style={estilos.textoSecundario}>
                <Text style={estilos.label}>Veículo:</Text> {item.modeloCarro}
              </Text>
              
              <View style={estilos.rodapeCard}>
                <Text style={estilos.textoData}>
                  {formatarDataExibicao(item.dataAgendamento)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={estilos.listaConteudo}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff', 
    paddingTop: 60 
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
    marginBottom: 10,
  },
  // Botão de debug temporário
  botaoDebug: {
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  textoBotaoDebug: {
    fontSize: 12,
    color: '#666',
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  textoCarregando: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  textoVazio: {
    marginTop: 16,
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  textoVazioSecundario: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  listaConteudo: {
    paddingBottom: 20,
  },
  card: { 
    backgroundColor: '#F8F9FA', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cabecalhoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  textoPrincipal: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#0B1F44',
    flex: 1,
    marginRight: 10,
  },
  status: { 
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  textoSecundario: { 
    fontSize: 14, 
    color: '#555',
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  rodapeCard: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textoData: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
  },
});