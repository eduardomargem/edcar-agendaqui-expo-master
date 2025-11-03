import React, { useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function Login() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={['#0B1F44', '#000000']} // azul-marinho → preto
      style={estilos.container}
      onLayout={onLayoutRootView}
    >
      <View style={estilos.card}>
        <View style={estilos.logoContainer}>
          <Image
            source={require('../assets/images/logoedcarpng.png')}
            style={estilos.logo}
            resizeMode="contain"
          />
          

          <Text style={estilos.nomeApp}>AgendAqui</Text>
        </View>
        <Text style={estilos.bemVindo}>Seja Bem-Vindo!</Text>
        <TextInput style={estilos.input} placeholder="Email" placeholderTextColor="#888888" />
        <TextInput style={estilos.input} placeholder="Senha" secureTextEntry placeholderTextColor="#888888" />

        <TouchableOpacity style={estilos.botao} onPress={() => router.replace('/menu')}>
          <Text style={estilos.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[estilos.botao, estilos.botaoSecundario]} onPress={() => router.push('/cadastro')}>
          <Text style={estilos.textoBotao}>Cadastrar-se</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF', // branco
    borderRadius: 20,
    padding: 30,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 110,
    height: 110,
  },
  nomeApp: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: '#0B1F44', // azul-marinho
    marginTop: 10,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#888888', // cinza
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  botao: {
    width: '100%',
    backgroundColor: '#0B1F44', // azul-marinho
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoSecundario: {
    backgroundColor: '#888888', // cinza para botão secundário
  },
  textoBotao: {
    color: '#FFFFFF', // branco
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  bemVindo: {
  fontSize: 20,
  fontFamily: 'Poppins_700Bold',
  color: '#0B1F44', // ou '#0B1F44' se dentro do card branco
  textAlign: 'center',
  marginBottom: 15,
},

});
