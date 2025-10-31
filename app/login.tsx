import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const fazerLogin = () => {
    if (email && senha) {
      router.replace('/menu'); // vai para Menu
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
    }
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.logoContainer}>
        <Image
          source={require('../assets/images/logoedcar.jpg')}
          style={estilos.logo}
          resizeMode="contain"
        />
        <Text style={estilos.nomeApp}>AgendAqui</Text>
      </View>

      <TextInput
        placeholder="Email"
        style={estilos.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        style={estilos.input}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Button title="Entrar" onPress={fazerLogin} />

      <View style={{ marginTop: 10 }}>
        <Button
          title="Cadastrar-se"
          color="#007AFF"
          onPress={() => router.push('/cadastro')}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 120, height: 120, marginBottom: 10 },
  nomeApp: { fontSize: 28, fontWeight: 'bold', color: '#007BFF' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});
