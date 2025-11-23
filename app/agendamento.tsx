import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Agendamento() {
  const { servico, servicoId, preco, duracao } = useLocalSearchParams<{ 
    servico: string; 
    servicoId: string;
    preco: string;
    duracao: string;
  }>();
  
  const router = useRouter();
  const { getUsuarioId } = useAuth();
  
  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [modeloCarro, setModeloCarro] = useState<string>('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  // Carregar horários disponíveis quando a data for selecionada
  useEffect(() => {
    if (dataSelecionada) {
      carregarHorariosDisponiveis();
    }
  }, [dataSelecionada]);

  const carregarHorariosDisponiveis = async () => {
    try {
      setCarregandoHorarios(true);
      setHorarioSelecionado(null);
      
      const horarios = await api.getHorariosDisponiveis(dataSelecionada);
      setHorariosDisponiveis(horarios);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      Alert.alert('Erro', 'Não foi possível carregar os horários disponíveis');
    } finally {
      setCarregandoHorarios(false);
    }
  };

  const confirmarAgendamento = async () => {
    if (!dataSelecionada || !horarioSelecionado) {
      Alert.alert('Erro', 'Selecione data e horário');
      return;
    }

    if (!modeloCarro.trim()) {
      Alert.alert('Erro', 'Informe o modelo do carro');
      return;
    }

    const clienteId = getUsuarioId();
    if (!clienteId) {
      Alert.alert('Erro', 'Usuário não logado');
      return;
    }

    try {
      setConfirmando(true);
      
      const agendamentoData = {
        clienteId: clienteId,
        servicoId: parseInt(servicoId),
        modeloCarro: modeloCarro.trim(),
        dataAgendamento: dataSelecionada,
        horario: horarioSelecionado
      };

      console.log('📝 Criando agendamento:', agendamentoData);
      
      await api.criarAgendamento(agendamentoData);
      
      // Mostra alerta de sucesso e redireciona automaticamente
      Alert.alert(
        'Sucesso', 
        'Agendamento confirmado!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Redireciona para a tela inicial (menu) automaticamente
              router.replace('/menu');
            }
          }
        ],
        // Esta opção faz com que o Alert feche automaticamente após 2 segundos
        // e redireciona mesmo se o usuário não clicar em OK
        { onDismiss: () => router.replace('/menu') }
      );
      
      // Redireciona automaticamente após 3 segundos, mesmo se o usuário não interagir
      setTimeout(() => {
        router.replace('/menu');
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      const mensagem = error instanceof Error ? error.message : 'Erro ao confirmar agendamento';
      Alert.alert('Erro', mensagem);
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.replace('/servicos')}>
        <Ionicons name="arrow-back" size={30} color="#0B1F44" />
      </TouchableOpacity>

      <Text style={estilos.titulo}>Agendar: {servico}</Text>
      <Text style={estilos.infoServico}>Preço: R$ {preco} • Duração: {duracao} min</Text>

      <Calendar
        onDayPress={(day) => {
          setDataSelecionada(day.dateString);
        }}
        markedDates={dataSelecionada ? { 
          [dataSelecionada]: { selected: true, selectedColor: '#0B1F44' } 
        } : {}}
        minDate={new Date().toISOString().split('T')[0]} // Só permite datas futuras
        theme={{
          todayTextColor: '#0B1F44',
          selectedDayBackgroundColor: '#0B1F44',
          monthTextColor: '#0B1F44',
          arrowColor: '#0B1F44',
        }}
      />

      <Text style={estilos.subtitulo}>
        Horários Disponíveis {dataSelecionada && `para ${dataSelecionada}`}:
      </Text>
      
      {carregandoHorarios ? (
        <Text style={estilos.carregando}>Carregando horários...</Text>
      ) : (
        <FlatList
          data={horariosDisponiveis}
          keyExtractor={(item) => item}
          horizontal
          contentContainerStyle={{ marginVertical: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                estilos.botaoHorario, 
                horarioSelecionado === item && estilos.horarioSelecionado
              ]}
              onPress={() => setHorarioSelecionado(item)}
            >
              <Text style={estilos.textoHorario}>{item}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            dataSelecionada ? (
              <Text style={estilos.vazio}>
                Nenhum horário disponível para esta data
              </Text>
            ) : null
          }
        />
      )}

      <Text style={estilos.subtitulo}>Modelo do carro:</Text>
      <TextInput
        style={estilos.input}
        placeholder="Ex: Corolla Prata 2020"
        value={modeloCarro}
        onChangeText={setModeloCarro}
      />

      <TouchableOpacity 
        style={[
          estilos.botaoConfirmar,
          (!dataSelecionada || !horarioSelecionado || !modeloCarro.trim() || confirmando) && estilos.botaoDesabilitado
        ]} 
        onPress={confirmarAgendamento}
        disabled={!dataSelecionada || !horarioSelecionado || !modeloCarro.trim() || confirmando}
      >
        <Text style={estilos.textoBotaoConfirmar}>
          {confirmando ? 'Confirmando...' : 'Confirmar Agendamento'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  infoServico: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 20 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  botaoHorario: { padding: 15, backgroundColor: '#555', borderRadius: 10, marginHorizontal: 5 },
  horarioSelecionado: { backgroundColor: '#0B1F44' },
  textoHorario: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, fontSize: 16 },
  botaoConfirmar: { marginTop: 20, backgroundColor: '#0B1F44', paddingVertical: 15, borderRadius: 5, alignItems: 'center' },
  botaoDesabilitado: { backgroundColor: '#ccc' },
  textoBotaoConfirmar: { color: '#fff', fontWeight: 'bold' },
  botaoVoltar: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
  carregando: { textAlign: 'center', color: '#666', marginVertical: 20 },
  vazio: { textAlign: 'center', color: '#666', marginVertical: 20 },
});