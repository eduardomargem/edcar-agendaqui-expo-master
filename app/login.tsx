import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function Login() {
  const router = useRouter();

  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');

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

  // ======== Lógica de Login ========
  const handleLogin = async () => {
    try {
      const email = emailInput.trim().toLowerCase();
      const senha = senhaInput.trim();

      if (!email || !senha) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
      }

      // Logins fixos de teste
      if (email === 'admin@teste.com' && senha === '1234') {
        router.replace('/admin/MenuAdmin');
        return;
      }

      if (email === 'funcionario@teste.com' && senha === '1234') {
        router.replace('/admin/MenuFuncionario');
        return;
      }

      if (email === 'cliente@teste.com' && senha === '1234') {
        router.replace('/menu');
        return;
      }

      // Verifica cliente salvo localmente
      const usuarioData = await AsyncStorage.getItem('usuario');
      if (!usuarioData) {
        Alert.alert('Erro', 'Nenhum cliente cadastrado.');
        return;
      }

      const usuario = JSON.parse(usuarioData);
      if (usuario.email === email && usuario.tipo === 'cliente') {
        router.replace('/menu');
      } else {
        Alert.alert('Erro', 'Usuário ou senha inválidos.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login. Tente novamente.');
    }
  };

  return (
    <LinearGradient
      colors={['#0B1F44', '#000000']}
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

        <TextInput
          style={estilos.input}
          placeholder="Email"
          placeholderTextColor="#888888"
          value={emailInput}
          onChangeText={setEmailInput}
        />

        <TextInput
          style={estilos.input}
          placeholder="Senha"
          placeholderTextColor="#888888"
          secureTextEntry
          value={senhaInput}
          onChangeText={setSenhaInput}
        />

        <TouchableOpacity style={estilos.botao} onPress={handleLogin}>
          <Text style={estilos.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.botao, estilos.botaoSecundario]}
          onPress={() => router.push('/cadastro')}
        >
          <Text style={estilos.textoBotao}>Cadastrar-se</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 110, height: 110 },
  nomeApp: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: '#0B1F44',
    marginTop: 10,
    letterSpacing: 1,
  },
  bemVindo: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#0B1F44',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#888888',
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
  },
  botao: {
    width: '100%',
    backgroundColor: '#0B1F44',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoSecundario: { backgroundColor: '#888888' },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});
