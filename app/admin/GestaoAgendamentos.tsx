import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function GestaoAgendamentos() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<'PENDENTE' | 'APROVADO' | 'CONCLUIDO' | 'REJEITADO'>('PENDENTE');

  const atualizarStatus = (novoStatus: typeof status) => {
    setStatus(novoStatus);
    Alert.alert('Status Atualizado', `O agendamento foi marcado como ${novoStatus}.`);
  };

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#0B1F44" />
      </TouchableOpacity>

      <Text style={estilos.titulo}>Gestão de Agendamento #{id}</Text>

      <Text style={estilos.statusAtual}>Status Atual: <Text style={estilos.status}>{status}</Text></Text>

      <TouchableOpacity style={[estilos.botao, { backgroundColor: '#0B1F44' }]} onPress={() => atualizarStatus('APROVADO')}>
        <Text style={estilos.textoBotao}>Aprovar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[estilos.botao, { backgroundColor: '#DC3545' }]} onPress={() => atualizarStatus('REJEITADO')}>
        <Text style={estilos.textoBotao}>Rejeitar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[estilos.botao, { backgroundColor: '#28A745' }]} onPress={() => atualizarStatus('CONCLUIDO')}>
        <Text style={estilos.textoBotao}>Marcar como Concluído</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  botaoVoltar: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
  titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  statusAtual: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  status: { fontWeight: 'bold', color: '#0B1F44' },
  botao: { padding: 15, borderRadius: 10, marginVertical: 10 },
  textoBotao: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});
