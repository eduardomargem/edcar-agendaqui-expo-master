import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Agendamento { servico: string; data: string; horario: string }

export default function Menu() {
  const params = useLocalSearchParams<{ servico?: string; data?: string; horario?: string }>();
  const { servico, data, horario } = params;
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    if (servico && data && horario) {
      setAgendamentos(prev => [...(prev||[]), { servico, data, horario }]);
    }
  }, [servico, data, horario]);

  const cancelarAgendamento = (index:number) => {
    Alert.alert('Cancelar Agendamento', 'Tem certeza?', [
      { text:'Não', style:'cancel' },
      { text:'Sim', onPress:() => setAgendamentos(prev=>prev.filter((_,i)=>i!==index)) }
    ]);
  };

  return (
    <View style={estilos.fundo}>
      <Text style={estilos.titulo}>Menu</Text>

      <TouchableOpacity style={estilos.botao} onPress={() => router.push('/servicos')}>
        <LinearGradient colors={['#555', '#0B1F44']} style={estilos.botaoGradiente}>
          <Text style={estilos.textoBotao}>Ver Serviços</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={estilos.botaoSair} onPress={() => router.replace('/login')}>
        <Text style={estilos.textoBotao}>Sair da Conta</Text>
      </TouchableOpacity>

      <Text style={estilos.subtitulo}>Meus Agendamentos:</Text>
      {agendamentos.length === 0 ? (
        <Text style={estilos.vazio}>Nenhum agendamento</Text>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(_,i)=>i.toString()}
          renderItem={({item,index})=>(
            <View style={estilos.agendamento}>
              <Text style={estilos.servico}>{item.servico}</Text>
              <Text style={estilos.info}>Data: {item.data}</Text>
              <Text style={estilos.info}>Horário: {item.horario}</Text>
              <Text style={estilos.status}>Status: Confirmado</Text>
              <TouchableOpacity style={estilos.botaoCancelar} onPress={()=>cancelarAgendamento(index)}>
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
  fundo: { flex:1, padding:20, backgroundColor:'#fff', paddingTop:60 },
  titulo: { fontSize:24, fontFamily:'Poppins_700Bold', textAlign:'center', color:'#0B1F44', marginBottom:20 },
  subtitulo: { fontSize:18, fontFamily:'Poppins_600SemiBold', marginVertical:15, color:'#0B1F44' },
  vazio: { textAlign:'center', color:'#666', marginTop:50, fontSize:16 },
  
  botao: { borderRadius:10, marginVertical:5 },
  botaoGradiente: { paddingVertical:15, borderRadius:10, alignItems:'center' },
  textoBotao: { color:'#fff', fontFamily:'Poppins_600SemiBold', fontSize:16 },

  botaoSair: { padding:15, backgroundColor:'#FF3B30', borderRadius:10, alignItems:'center', marginVertical:5 },

  agendamento: { padding:15, backgroundColor:'#007AFF', marginBottom:10, borderRadius:10 },
  servico: { color:'#fff', fontSize:16, fontFamily:'Poppins_600SemiBold' },
  info: { color:'#fff', fontSize:14 },
  status: { color:'#e0e0e0', fontSize:12, marginTop:5 },

  botaoCancelar: { marginTop:10, backgroundColor:'#FF3B30', padding:8, borderRadius:5 },
  textoCancelar: { color:'#fff', fontFamily:'Poppins_600SemiBold', textAlign:'center' },
});
