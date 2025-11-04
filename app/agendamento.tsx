import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const horariosDisponiveis = ['09:00','10:00','11:00','13:00','14:00','15:00'];

export default function Agendamento() {
  const { servico } = useLocalSearchParams<{ servico: string }>();
  const router = useRouter();
  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [observacao, setObservacao] = useState<string>('');

  const confirmarAgendamento = () => {
    if (!dataSelecionada || !horarioSelecionado) {
      Alert.alert('Erro', 'Selecione data e horário');
      return;
    }
    Alert.alert(
      'Agendamento Confirmado',
      `Serviço: ${servico}\nData: ${dataSelecionada}\nHorário: ${horarioSelecionado}\nModelo: ${observacao || 'Não informado'}`
    );
    router.replace(
      `/menu?servico=${encodeURIComponent(servico!)}&data=${encodeURIComponent(dataSelecionada)}&horario=${encodeURIComponent(horarioSelecionado)}&observacao=${encodeURIComponent(observacao)}`
    );
  };

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.replace('/servicos')}>
        <Ionicons name="arrow-back" size={30} color="#0B1F44" />
      </TouchableOpacity>

      <Text style={estilos.titulo}>Agendar: {servico}</Text>

      <Calendar
        onDayPress={(day) => { setDataSelecionada(day.dateString); setHorarioSelecionado(null); }}
        markedDates={dataSelecionada ? { [dataSelecionada]: { selected: true, selectedColor: '#0B1F44' } } : {}}
        theme={{ todayTextColor:'#0B1F44', selectedDayBackgroundColor:'#0B1F44', monthTextColor:'#0B1F44', arrowColor:'#0B1F44' }}
      />

      <Text style={estilos.subtitulo}>Horários Disponíveis:</Text>
      <FlatList
        data={horariosDisponiveis}
        keyExtractor={(item) => item}
        horizontal
        contentContainerStyle={{ marginVertical:20 }}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[estilos.botaoHorario, horarioSelecionado===item && estilos.horarioSelecionado]}
            onPress={()=>setHorarioSelecionado(item)}>
            <Text style={estilos.textoHorario}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={estilos.subtitulo}>Modelo do carro:</Text>
      <TextInput
        style={estilos.input}
        placeholder="Ex: Corolla Prata 2020"
        value={observacao}
        onChangeText={setObservacao}
      />

      <TouchableOpacity style={estilos.botaoConfirmar} onPress={confirmarAgendamento}>
        <Text style={estilos.textoBotaoConfirmar}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:'#fff', paddingTop:60 },
  titulo:{ fontSize:22, fontWeight:'bold', textAlign:'center', marginBottom:20, marginTop: 10 },
  subtitulo:{ fontSize:18, fontWeight:'bold', marginVertical:10 },
  botaoHorario:{ padding:15, backgroundColor:'#555', borderRadius:10, marginHorizontal:5 },
  horarioSelecionado:{ backgroundColor:'#0B1F44' },
  textoHorario:{ color:'#fff', fontWeight:'bold', textAlign:'center' },
  input:{ borderWidth:1, borderColor:'#ccc', borderRadius:10, padding:10, fontSize:16 },
  botaoConfirmar:{ marginTop:20, backgroundColor:'#0B1F44', paddingVertical:15, borderRadius:5, alignItems:'center' },
  textoBotaoConfirmar:{ color:'#fff', fontWeight:'bold' },
  botaoVoltar:{ position:'absolute', top:40, left:20, zIndex:10 },
});
