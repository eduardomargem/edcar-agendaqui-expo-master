import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Phone, Clock, CreditCard } from 'lucide-react-native';

export default function ComoChegar() {
  const router = useRouter();

  const abrirMapa = () => {
    const endereco = encodeURIComponent('Rua das Palmeiras, 123 - Centro, São Paulo - SP');
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${endereco}`);
  };

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Text style={estilos.titulo}>Como Chegar</Text>

      <View style={estilos.card}>
        <MapPin color="#0B1F44" size={24} />
        <Text style={estilos.texto}>
          Rua das Palmeiras, 123 - Centro, São Paulo - SP
        </Text>
      </View>

      <View style={estilos.card}>
        <Phone color="#0B1F44" size={24} />
        <Text style={estilos.texto}>
          Telefone: (11) 99999-9999
        </Text>
      </View>

      <View style={estilos.card}>
        <Clock color="#0B1F44" size={24} />
        <Text style={estilos.texto}>
          Horário de funcionamento: Segunda a Sábado, 8h às 18h
        </Text>
      </View>

      <TouchableOpacity style={estilos.botaoMapa} onPress={abrirMapa}>
        <Text style={estilos.textoBotao}>Ver no Google Maps</Text>
      </TouchableOpacity>

      <View style={[estilos.card, { marginTop: 25 }]}>
        <CreditCard color="#0B1F44" size={24} />
        <Text style={[estilos.texto, { fontWeight: '600' }]}>Formas de Pagamento</Text>
      </View>
      <Text style={estilos.pagamento}>
        O pagamento é realizado **no local, após a conclusão do serviço**.  
        Aceitamos dinheiro, Pix e cartões de débito e crédito.  
        (Por enquanto, não oferecemos pagamento online.)
      </Text>

      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.push('/menu')}>
        <Text style={estilos.textoBotao}>← Voltar ao Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  titulo: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#0B1F44',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    marginLeft: 10,
    color: '#0B1F44',
    fontFamily: 'Poppins_500Medium',
  },
  botaoMapa: {
    backgroundColor: '#0B1F44',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  pagamento: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginTop: 8,
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
    fontFamily: 'Poppins_400Regular',
  },
  botaoVoltar: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});
