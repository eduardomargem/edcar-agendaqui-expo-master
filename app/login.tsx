import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth'; // Ajuste o caminho conforme sua estrutura

SplashScreen.preventAutoHideAsync();

export default function Login() {
  const router = useRouter();
  const { login, carregando: carregandoAuth } = useAuth();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tentandoLogin, setTentandoLogin] = useState(false);

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

  const handleLogin = async () => {
    // Validações básicas
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    setTentandoLogin(true);

    try {
      const clienteLogado = await login({ email, senha });
      
      // Login bem-sucedido - navegar para o menu
      console.log('Login realizado com sucesso:', clienteLogado.nome);
      
      // Navegação direta sem alerta (mais fluido)
      router.replace('/menu');
      
    } catch (error: any) {
      // Mostrar mensagem de erro específica
      let mensagemErro = 'Erro ao fazer login. Tente novamente.';
      
      if (error.message.includes('Email ou senha inválidos')) {
        mensagemErro = 'Email ou senha incorretos. Verifique suas credenciais.';
      } else if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        mensagemErro = 'Erro de conexão. Verifique se o servidor está rodando.';
      } else if (error.message.includes('Email já cadastrado')) {
        mensagemErro = 'Este email já está cadastrado.';
      }
      
      Alert.alert('Erro no Login', mensagemErro);
      console.error('Erro detalhado no login:', error);
    } finally {
      setTentandoLogin(false);
    }
  };

  const handleCadastro = () => {
    router.push('/cadastro');
  };

  // Se as fontes não carregaram, mostra um loading
  if (!fontsLoaded) {
    return (
      <View style={[estilos.container, estilos.centralizado]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={estilos.textoCarregando}>Carregando...</Text>
      </View>
    );
  }

  // Estado combinado de carregamento
  const estaCarregando = carregandoAuth || tentandoLogin;

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
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!estaCarregando}
          autoComplete="email"
        />
        
        <TextInput 
          style={estilos.input} 
          placeholder="Senha" 
          secureTextEntry 
          placeholderTextColor="#888888"
          value={senha}
          onChangeText={setSenha}
          editable={!estaCarregando}
          autoComplete="password"
        />

        <TouchableOpacity 
          style={[
            estilos.botao, 
            (estaCarregando || !email || !senha) && estilos.botaoDesabilitado
          ]} 
          onPress={handleLogin}
          disabled={estaCarregando || !email || !senha}
        >
          {estaCarregando ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={estilos.textoBotao}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[estilos.botao, estilos.botaoSecundario]} 
          onPress={handleCadastro}
          disabled={estaCarregando}
        >
          <Text style={estilos.textoBotao}>Cadastrar-se</Text>
        </TouchableOpacity>

        {/* Link para recuperação de senha (opcional) */}
        <TouchableOpacity style={estilos.linkSenha}>
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
  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCarregando: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
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
  botaoDesabilitado: {
    backgroundColor: '#cccccc',
  },
  botaoSecundario: {
    backgroundColor: '#888888',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  bemVindo: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#0B1F44',
    textAlign: 'center',
    marginBottom: 15,
  },
  linkSenha: {
    marginTop: 15,
    alignItems: 'center',
  },
  textoLink: {
    color: '#0B1F44',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    textDecorationLine: 'underline',
  },
});