import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const horariosDisponiveis = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];

export default function Agendamento() {
  const { servico } = useLocalSearchParams<{ servico: string }>();
  const router = useRouter();

  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);

  const confirmarAgendamento = () => {
    if (!dataSelecionada || !horarioSelecionado) {
      Alert.alert('Erro', 'Selecione data e horário');
      return;
    }

    Alert.alert(
      'Agendamento Confirmado',
      `Serviço: ${servico}\nData: ${dataSelecionada}\nHorário: ${horarioSelecionado}`
    );

    // Envia os dados para Menu usando query params
    router.replace(`/menu?servico=${encodeURIComponent(servico!)}&data=${encodeURIComponent(dataSelecionada)}&horario=${encodeURIComponent(horarioSelecionado)}`);
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Agendar: {servico}</Text>

      <Calendar
        onDayPress={(day) => {
          setDataSelecionada(day.dateString);
          setHorarioSelecionado(null); // reset horário ao mudar data
        }}
        markedDates={dataSelecionada ? { [dataSelecionada]: { selected: true } } : {}}
      />

      <Text style={estilos.subtitulo}>Horários Disponíveis:</Text>
      <FlatList
        data={horariosDisponiveis}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[estilos.botaoHorario, horarioSelecionado === item && estilos.horarioSelecionado]}
            onPress={() => setHorarioSelecionado(item)}
          >
            <Text style={estilos.textoHorario}>{item}</Text>
          </TouchableOpacity>
        )}
        horizontal
        contentContainerStyle={{ marginVertical: 20 }}
      />

      <Button title="Confirmar Agendamento" onPress={confirmarAgendamento} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  botaoHorario: { padding: 15, backgroundColor: '#ccc', borderRadius: 5, marginHorizontal: 5 },
  horarioSelecionado: { backgroundColor: '#007AFF' },
  textoHorario: { color: '#fff', fontWeight: 'bold' },
});
