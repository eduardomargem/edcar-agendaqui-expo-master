import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';

const horariosDisponiveis = ['09:00','10:00','11:00','13:00','14:00','15:00'];

export default function Agendamento() {
  const { servico } = useLocalSearchParams<{ servico: string }>();
  const router = useRouter();
  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);

  const confirmarAgendamento = () => {
    if(!dataSelecionada || !horarioSelecionado){
      Alert.alert('Erro','Selecione data e horário');
      return;
    }
    Alert.alert(
      'Agendamento Confirmado',
      `Serviço: ${servico}\nData: ${dataSelecionada}\nHorário: ${horarioSelecionado}`
    );
    router.replace(
      `/menu?servico=${encodeURIComponent(servico!)}&data=${encodeURIComponent(dataSelecionada)}&horario=${encodeURIComponent(horarioSelecionado)}`
    );
  }

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.replace('/servicos')}>
        <LinearGradient colors={['#555','#0B1F44']} style={estilos.botaoVoltarGradiente}>
          <Text style={estilos.textoBotaoVoltar}>← Voltar</Text>
        </LinearGradient>
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
          <TouchableOpacity style={[estilos.botaoHorario, horarioSelecionado===item && estilos.horarioSelecionado]} onPress={()=>setHorarioSelecionado(item)}>
            <Text style={estilos.textoHorario}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={estilos.botaoConfirmar} onPress={confirmarAgendamento}>
        <Text style={estilos.textoBotaoConfirmar}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:'#fff', paddingTop:60 },
  titulo:{ fontSize:22, fontWeight:'bold', textAlign:'center', marginBottom:20 },
  subtitulo:{ fontSize:18, fontWeight:'bold', marginVertical:10 },
  botaoHorario:{ padding:15, backgroundColor:'#555', borderRadius:10, marginHorizontal:5 },
  horarioSelecionado:{ backgroundColor:'#0B1F44' },
  textoHorario:{ color:'#fff', fontWeight:'bold', textAlign:'center' },
  botaoConfirmar:{ marginTop:20, backgroundColor:'#0B1F44', paddingVertical:15, borderRadius:10, alignItems:'center' },
  textoBotaoConfirmar:{ color:'#fff', fontWeight:'bold' },

  botaoVoltar:{ position:'absolute', top:40, left:20, zIndex:10 },
  botaoVoltarGradiente:{ paddingHorizontal:15, paddingVertical:8, borderRadius:20 },
  textoBotaoVoltar:{ color:'#fff', fontWeight:'bold' },
});
