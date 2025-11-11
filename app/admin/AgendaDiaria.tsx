import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Agendamento {
  servico: string;
  data: string;
  horario: string;
  observacao?: string;
  nomeCliente?: string;
  status?: 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';
}

export default function AgendaDiaria() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarAgendamentos = useCallback(async () => {
    try {
      setCarregando(true);
      const json = await AsyncStorage.getItem('agendamentos');
      const dados: Agendamento[] = json ? JSON.parse(json) : [];
      setAgendamentos(dados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os agendamentos');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarAgendamentos();
  }, [carregarAgendamentos]);

  const statusCor = (status: Agendamento['status']) => {
    switch (status) {
      case 'PENDENTE': return '#FFA500';
      case 'CONFIRMADO': return '#0B1F44';
      case 'CONCLUIDO': return '#28A745';
      case 'CANCELADO': return '#DC3545';
      default: return '#555';
    }
  };

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#0B1F44" />
      </TouchableOpacity>

      <Text style={estilos.titulo}>Agenda do Dia</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#0B1F44" />
      ) : agendamentos.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#777', marginTop: 20 }}>Nenhum agendamento encontrado</Text>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(_, i) => i.toString()}
          refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregarAgendamentos} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[estilos.card, { borderLeftColor: statusCor(item.status) }]}
              onPress={() => router.push({ pathname: '/admin/GestaoAgendamentos', params: { servico: item.servico, data: item.data, horario: item.horario } })}
            >
              <Text style={estilos.textoPrincipal}>{item.servico}</Text>
              <Text style={estilos.textoSecundario}>Data: {item.data}</Text>
              <Text style={estilos.textoSecundario}>Horário: {item.horario}</Text>
              <Text style={estilos.textoSecundario}>Modelo: {item.observacao || 'Não informado'}</Text>
              <Text style={[estilos.status, { color: statusCor(item.status) }]}>
                {item.status || 'PENDENTE'}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  botaoVoltar: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
  titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#F4F4F4', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 6 },
  textoPrincipal: { fontSize: 16, fontWeight: 'bold' },
  textoSecundario: { fontSize: 14, color: '#555' },
  status: { marginTop: 5, fontWeight: 'bold' },
});
