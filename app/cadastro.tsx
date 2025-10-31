import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const router = useRouter();

  const fazerCadastro = () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    Alert.alert('Cadastro realizado', `Bem-vindo, ${nome}!`);
    router.replace('/menu'); // vai para Menu
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Cadastro</Text>

      <TextInput placeholder="Nome" style={estilos.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="Email" style={estilos.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Senha" style={estilos.input} secureTextEntry value={senha} onChangeText={setSenha} />
      <TextInput placeholder="Confirmar Senha" style={estilos.input} secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />

      <Button title="Cadastrar" onPress={fazerCadastro} />

      <View style={{ marginTop: 10 }}>
        <Button title="Voltar para Login" color="#999" onPress={() => router.replace('/login')} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#007BFF', textAlign: 'center', marginBottom: 30 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});
