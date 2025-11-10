import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ResumoFinanceiro() {
  const router = useRouter();
  const [dados, setDados] = useState<{ total: number; receita: number } | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setDados({ total: 24, receita: 1349.76 });
    }, 800);
  }, []);

  if (!dados) {
    return (
      <View style={[estilos.container, estilos.centralizado]}>
        <ActivityIndicator size="large" color="#0B1F44" />
        <Text>Carregando resumo...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#0B1F44" />
      </TouchableOpacity>

      <Text style={estilos.titulo}>Resumo Financeiro</Text>

      <View style={estilos.card}>
        <Text style={estilos.valor}>{dados.total}</Text>
        <Text style={estilos.label}>Serviços Concluídos</Text>
      </View>

      <View style={estilos.card}>
        <Text style={estilos.valor}>R$ {dados.receita.toFixed(2)}</Text>
        <Text style={estilos.label}>Receita Estimada</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  centralizado: { justifyContent: 'center', alignItems: 'center' },
  botaoVoltar: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
  titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#F4F4F4', padding: 25, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  valor: { fontSize: 28, fontWeight: 'bold', color: '#0B1F44' },
  label: { fontSize: 16, color: '#555' },
});
