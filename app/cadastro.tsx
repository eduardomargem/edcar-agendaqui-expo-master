import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Animated,
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

SplashScreen.preventAutoHideAsync();

export default function Cadastro() {
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

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fazerCadastro = () => {
    if (!nome || !cpf || !telefone || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    Alert.alert('Cadastro realizado', `Bem-vindo, ${nome}!`);
    router.replace('/menu');
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={['#0B1F44', '#000000']}
      style={estilos.container}
      onLayout={onLayoutRootView}
    >
      <Animated.View
        style={[
          estilos.card,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={estilos.logoContainer}>
          <Image
            source={require('../assets/images/logoedcarpng.png')}
            style={estilos.logo}
            resizeMode="contain"
          />
          <Text style={estilos.nomeApp}>AgendAqui</Text>
        </View>

        <TextInput
          style={estilos.input}
          placeholder="Nome"
          placeholderTextColor="#888888"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={estilos.input}
          placeholder="CPF"
          placeholderTextColor="#888888"
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
        />
        <TextInput
          style={estilos.input}
          placeholder="Telefone"
          placeholderTextColor="#888888"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />
        <TextInput
          style={estilos.input}
          placeholder="Email"
          placeholderTextColor="#888888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={estilos.input}
          placeholder="Senha"
          placeholderTextColor="#888888"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={estilos.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="#888888"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <TouchableOpacity style={estilos.botao} onPress={fazerCadastro}>
          <Text style={estilos.textoBotao}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.botao, estilos.botaoSecundario]}
          onPress={() => router.replace('/login')}
        >
          <Text style={estilos.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </Animated.View>
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
    color: '#0B1F44',
    marginTop: 10,
    letterSpacing: 1,
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  botao: {
    width: '100%',
    backgroundColor: '#0B1F44',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoSecundario: {
    backgroundColor: '#888888',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});
