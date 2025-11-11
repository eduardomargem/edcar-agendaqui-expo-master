import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Agendamento {
  servico: string;
  data: string;
  horario: string;
  observacao?: string;
}

export default function Menu() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  // Carrega os agendamentos salvos
  useEffect(() => {
    const carregarAgendamentos = async () => {
      const dados = await AsyncStorage.getItem('agendamentos');
      if (dados) setAgendamentos(JSON.parse(dados));
    };
    carregarAgendamentos();
  }, []);

  const cancelarAgendamento = (index: number) => {
    Alert.alert('Cancelar Agendamento', 'Tem certeza?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          const atualizados = agendamentos.filter((_, i) => i !== index);
          setAgendamentos(atualizados);
          await AsyncStorage.setItem('agendamentos', JSON.stringify(atualizados));
        },
      },
    ]);
  };

  return (
    <View style={estilos.fundo}>
      <Text style={estilos.titulo}>Meu Perfil</Text>

      <TouchableOpacity
        style={[estilos.botao, { backgroundColor: '#007AFF' }]}
        onPress={() => router.push('/comochegar')}>
        <Text style={estilos.textoBotao}>Como Chegar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[estilos.botao, { backgroundColor: '#0B1F44' }]}
        onPress={() => router.push('/servicos')}>
        <Text style={estilos.textoBotao}>Ver Serviços</Text>
      </TouchableOpacity>

      <Text style={estilos.subtitulo}>Meus Agendamentos:</Text>

      {agendamentos.length === 0 ? (
        <Text style={estilos.vazio}>Nenhum agendamento</Text>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View style={estilos.agendamento}>
              <Text style={estilos.servico}>{item.servico}</Text>
              <Text style={estilos.info}>Data: {item.data}</Text>
              <Text style={estilos.info}>Horário: {item.horario}</Text>
              <Text style={estilos.info}>Modelo: {item.observacao || 'Não informado'}</Text>
              <Text style={estilos.status}>Status: Confirmado</Text>

              <TouchableOpacity
                style={estilos.botaoCancelar}
                onPress={() => cancelarAgendamento(index)}>
                <Text style={estilos.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={estilos.botaoSair} onPress={() => router.replace('/login')}>
        <Text style={estilos.textoBotao}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#0B1F44', marginBottom: 20 },
  subtitulo: { fontSize: 18, fontWeight: '600', marginVertical: 15, color: '#0B1F44' },
  vazio: { textAlign: 'center', color: '#666', marginTop: 50, fontSize: 16 },
  botao: { borderRadius: 5, marginVertical: 5, alignItems: 'center', paddingVertical: 15 },
  textoBotao: { color: '#fff', fontWeight: '600', fontSize: 16 },
  botaoSair: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    alignItems: 'center',
  },
  agendamento: { padding: 15, backgroundColor: '#0B1F44', marginBottom: 10, borderRadius: 10 },
  servico: { color: '#fff', fontSize: 16, fontWeight: '600' },
  info: { color: '#fff', fontSize: 14 },
  status: { color: '#e0e0e0', fontSize: 12, marginTop: 5 },
  botaoCancelar: { marginTop: 10, backgroundColor: '#FF3B30', padding: 8, borderRadius: 5 },
  textoCancelar: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});
