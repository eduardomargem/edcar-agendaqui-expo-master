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
  ActivityIndicator,
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
import { api, CadastroClienteRequest } from '../services/api';
import { useAuth } from '../hooks/useAuth';

SplashScreen.preventAutoHideAsync();

export default function Cadastro() {
  const router = useRouter();
  const { login } = useAuth();

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
  const [carregando, setCarregando] = useState(false);

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

  // Função para formatar CPF
  const formatarCpf = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 11) {
      let formatted = numbers;
      if (numbers.length > 3) {
        formatted = numbers.substring(0, 3) + '.' + numbers.substring(3);
      }
      if (numbers.length > 6) {
        formatted = formatted.substring(0, 7) + '.' + formatted.substring(7);
      }
      if (numbers.length > 9) {
        formatted = formatted.substring(0, 11) + '-' + formatted.substring(11, 13);
      }
      return formatted;
    }
    return numbers.substring(0, 14);
  };

  // Função para formatar telefone
  const formatarTelefone = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 11) {
      let formatted = numbers;
      if (numbers.length > 2) {
        formatted = '(' + numbers.substring(0, 2) + ') ' + numbers.substring(2);
      }
      if (numbers.length > 7) {
        formatted = formatted.substring(0, 10) + '-' + formatted.substring(10);
      }
      return formatted;
    }
    return numbers.substring(0, 15);
  };

  const validarCampos = (): boolean => {
    if (!nome || !cpf || !telefone || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return false;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return false;
    }

    if (senha.length < 4) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 4 caracteres');
      return false;
    }

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      Alert.alert('Erro', 'CPF deve ter 11 dígitos');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Email inválido');
      return false;
    }

    return true;
  };

  const fazerCadastro = async () => {
    if (!validarCampos()) {
      return;
    }

    try {
      setCarregando(true);

      // Verificar se email já existe
      const emailExiste = await api.verificarEmailCliente(email);
      if (emailExiste) {
        Alert.alert('Erro', 'Este email já está cadastrado');
        return;
      }

      // Verificar se CPF já existe
      const cpfLimpo = cpf.replace(/\D/g, '');
      const cpfExiste = await api.verificarCpfCliente(cpfLimpo);
      if (cpfExiste) {
        Alert.alert('Erro', 'Este CPF já está cadastrado');
        return;
      }

      // Preparar dados para cadastro
      const dadosCadastro: CadastroClienteRequest = {
        nome: nome.trim(),
        cpf: cpfLimpo,
        telefone: telefone.replace(/\D/g, ''),
        email: email.trim().toLowerCase(),
        senha: senha.trim()
      };

      // Fazer cadastro no backend
      const clienteCadastrado = await api.cadastrarCliente(dadosCadastro);

      // Fazer login automático após cadastro
      await login(email, senha);

      Alert.alert('Sucesso', `Cadastro realizado com sucesso! Bem-vindo, ${nome}!`);
      router.replace('/menu');

    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro no Cadastro', error.message || 'Falha ao realizar cadastro. Tente novamente.');
    } finally {
      setCarregando(false);
    }
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

        <Text style={estilos.titulo}>Criar sua conta</Text>

        <TextInput
          style={estilos.input}
          placeholder="Nome completo"
          placeholderTextColor="#888888"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        <TextInput
          style={estilos.input}
          placeholder="CPF"
          placeholderTextColor="#888888"
          keyboardType="numeric"
          value={cpf}
          onChangeText={(text) => setCpf(formatarCpf(text))}
          maxLength={14}
        />

        <TextInput
          style={estilos.input}
          placeholder="Telefone"
          placeholderTextColor="#888888"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={(text) => setTelefone(formatarTelefone(text))}
          maxLength={15}
        />

        <TextInput
          style={estilos.input}
          placeholder="Email"
          placeholderTextColor="#888888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
        />

        <TextInput
          style={estilos.input}
          placeholder="Senha"
          placeholderTextColor="#888888"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          autoComplete="new-password"
        />

        <TextInput
          style={estilos.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="#888888"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          autoComplete="new-password"
        />

        <TouchableOpacity 
          style={[estilos.botao, carregando && estilos.botaoDesabilitado]} 
          onPress={fazerCadastro}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={estilos.textoBotao}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.botao, estilos.botaoSecundario]}
          onPress={() => router.replace('/login')}
        >
          <Text style={estilos.textoBotao}>Voltar para Login</Text>
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
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  nomeApp: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#0B1F44',
    marginTop: 8,
  },
  titulo: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#0B1F44',
    textAlign: 'center',
    marginBottom: 20,
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
  botaoDesabilitado: {
    backgroundColor: '#666666',
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