import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

interface Agendamento {
  servico: string;
  data: string;
  horario: string;
}

export default function Menu() {
  const params = useLocalSearchParams<{ servico?: string; data?: string; horario?: string }>();
  const { servico, data, horario } = params;
  const router = useRouter();

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    if (servico && data && horario) {
      setAgendamentos(prev => [...(prev || []), { servico, data, horario }]);
    }
  }, [servico, data, horario]);

  const cancelarAgendamento = (index: number) => {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => setAgendamentos(prev => prev.filter((_, i) => i !== index)) }
      ]
    );
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Menu</Text>

      <Button title="Ver Serviços" onPress={() => router.push('/servicos')} />
      <View style={{ marginTop: 10 }}>
        <Button title="Sair da Conta" color="#FF3B30" onPress={() => router.replace('/login')} />
      </View>

      <Text style={estilos.subtitulo}>Meus Agendamentos:</Text>
      {agendamentos.length === 0 ? (
        <Text style={estilos.vazio}>Nenhum agendamento</Text>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={estilos.agendamento}>
              <Text style={estilos.servico}>{item.servico}</Text>
              <Text style={estilos.info}>Data: {item.data}</Text>
              <Text style={estilos.info}>Horário: {item.horario}</Text>
              <Text style={estilos.status}>Status: Confirmado</Text>
              <TouchableOpacity style={estilos.botaoCancelar} onPress={() => cancelarAgendamento(index)}>
                <Text style={estilos.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
  agendamento: { padding: 15, backgroundColor: '#007AFF', marginBottom: 10, borderRadius: 5 },
  servico: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  info: { color: '#fff', fontSize: 14 },
  status: { color: '#e0e0e0', fontSize: 12, marginTop: 5 },
  vazio: { textAlign: 'center', color: '#666', fontSize: 16, marginTop: 50 },
  botaoCancelar: { marginTop: 10, backgroundColor: '#FF3B30', padding: 8, borderRadius: 5 },
  textoCancelar: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
