import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, ClipboardCheck, BarChart3 } from 'lucide-react-native';

export default function MenuAdmin() {
  const router = useRouter();

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Painel Administrativo</Text>

      <View style={estilos.opcoes}>
        <TouchableOpacity style={estilos.card} onPress={() => router.push('/admin/AgendaDiaria')}>
          <Calendar color="#0B1F44" size={28} />
          <Text style={estilos.textoCard}>Agenda do Dia</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.card} onPress={() => router.push('/admin/GestaoAgendamentos')}>
          <ClipboardCheck color="#0B1F44" size={28} />
          <Text style={estilos.textoCard}>Gestão de Agendamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.card} onPress={() => router.push('/admin/ResumoFinanceiro')}>
          <BarChart3 color="#0B1F44" size={28} />
          <Text style={estilos.textoCard}>Resumo Financeiro</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={estilos.botaoSair} onPress={() => router.replace('/login')}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={estilos.textoSair}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#0B1F44' },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
  card: {
    width: '40%',
    backgroundColor: '#F4F4F4',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  textoCard: { marginTop: 10, fontWeight: '600', color: '#0B1F44', textAlign: 'center' },
  botaoSair: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#0B1F44',
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  textoSair: { color: '#fff', marginLeft: 8, fontWeight: 'bold' },
});
