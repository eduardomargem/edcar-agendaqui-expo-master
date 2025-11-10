import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  horario: string;
  status: 'PENDENTE' | 'APROVADO' | 'CONCLUIDO' | 'REJEITADO';
}

export default function AgendaDiaria() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarAgendamentos = () => {
    setCarregando(true);
    setTimeout(() => {
      setAgendamentos([
        { id: 1, cliente: 'João', servico: 'DUCHA STANDARD', horario: '09:00', status: 'PENDENTE' },
        { id: 2, cliente: 'Maria', servico: 'DELUXE', horario: '10:00', status: 'APROVADO' },
        { id: 3, cliente: 'Carlos', servico: 'ECONOMY', horario: '13:00', status: 'CONCLUIDO' },
      ]);
      setCarregando(false);
    }, 1000);
  };

  useEffect(() => { carregarAgendamentos(); }, []);

  const statusCor = (status: Agendamento['status']) => {
    switch (status) {
      case 'PENDENTE': return '#FFA500';
      case 'APROVADO': return '#0B1F44';
      case 'CONCLUIDO': return '#28A745';
      case 'REJEITADO': return '#DC3545';
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
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregarAgendamentos} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[estilos.card, { borderLeftColor: statusCor(item.status) }]}
              onPress={() => router.push({ pathname: '/admin/GestaoAgendamentos', params: { id: item.id.toString() } })}
            >
              <Text style={estilos.textoPrincipal}>{item.servico}</Text>
              <Text style={estilos.textoSecundario}>Cliente: {item.cliente}</Text>
              <Text style={estilos.textoSecundario}>Horário: {item.horario}</Text>
              <Text style={[estilos.status, { color: statusCor(item.status) }]}>{item.status}</Text>
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
