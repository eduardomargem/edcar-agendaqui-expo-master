import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
  Button, 
  FlatList, 
  Modal, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';

interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracao_min: number;
  descricao?: string;
  ativo: boolean;
  itensInclusos?: string[];
}

export default function Servicos() {
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);

  const recarregar = () => {
    setCarregando(true);
    setTimeout(() => {
      setServicos([
        { 
          id: 1, 
          nome: 'Ducha Standard', 
          preco: 34.99, 
          duracao_min: 30, 
          descricao: 'Básica', 
          ativo: true,
          itensInclusos: ['Aspiração', 'Lavagem', 'Secagem', 'Pretinho'] 
        },
        { 
          id: 2, 
          nome: 'Economy', 
          preco: 39.99, 
          duracao_min: 60, 
          descricao: 'Completa', 
          ativo: true,
          itensInclusos: ['Aspiração', 'Lavagem', 'Secagem', 'Pretinho', 'Painel', 'Vidros']
        },
        { 
          id: 3, 
          nome: 'ADVANCED', 
          preco: 39.99, 
          duracao_min: 60, 
          descricao: 'Cera de cerâmica', 
          ativo: true,
          itensInclusos: ['LAVAGEM COMPLETA','CERA DE CERAMIC', 'PAINEL', 'VIDROS', 'CAIXA DE RODA', 'PRETINHO']
        },
        { 
          id: 4, 
          nome: 'Economy', 
          preco: 39.99, 
          duracao_min: 60, 
          descricao: 'Completa', 
          ativo: true,
          itensInclusos: ['Aspiração', 'Lavagem', 'Secagem', 'Pretinho', 'Painel', 'Vidros']
        },
        { 
          id: 5, 
          nome: 'Economy', 
          preco: 39.99, 
          duracao_min: 60, 
          descricao: 'Completa', 
          ativo: true,
          itensInclusos: ['Aspiração', 'Lavagem', 'Secagem', 'Pretinho', 'Painel', 'Vidros']
        },
        { 
          id: 6, 
          nome: 'Economy', 
          preco: 39.99, 
          duracao_min: 60, 
          descricao: 'Completa', 
          ativo: true,
          itensInclusos: ['Aspiração', 'Lavagem', 'Secagem', 'Pretinho', 'Painel', 'Vidros']
        },
      ]);
      setCarregando(false);
    }, 1000);
  };

  useEffect(() => {
    recarregar();
  }, []);

  const abrirModal = (servico: Servico) => { 
    setServicoSelecionado(servico); 
    setModalVisivel(true); 
  };

  const fecharModal = () => { 
    setModalVisivel(false); 
    setServicoSelecionado(null); 
  };

  if (carregando && servicos.length === 0) {
    return (
      <View style={[estilos.container, estilos.centralizado]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando serviços...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.replace('/menu')}>
        <Text style={estilos.textoVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={estilos.titulo}>Escolha um serviço</Text>
      <FlatList
        data={servicos.filter(s => s.ativo)}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={carregando} onRefresh={recarregar} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={estilos.botao} onPress={() => abrirModal(item)}>
            <Text style={estilos.textoBotao}>{item.nome}</Text>
            <Text style={estilos.preco}>R$ {item.preco.toFixed(2)}</Text>
            <Text style={estilos.duracao}>{item.duracao_min} min</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={estilos.vazio}>Nenhum serviço disponível</Text>}
      />

      <Modal visible={modalVisivel} transparent animationType="slide" onRequestClose={fecharModal}>
        <View style={estilos.fundoModal}>
          {servicoSelecionado && (
            <View style={estilos.modal}>
              <Text style={estilos.tituloModal}>{servicoSelecionado.nome}</Text>
              <Text style={estilos.descricaoModal}>{servicoSelecionado.descricao}</Text>

              {servicoSelecionado.itensInclusos && (
                <>
                  <Text style={estilos.subtituloModal}>Incluso nesta lavagem:</Text>
                  {servicoSelecionado.itensInclusos.map((item, index) => (
                    <Text key={index} style={estilos.itemIncluso}>• {item}</Text>
                  ))}
                </>
              )}

              <Text style={estilos.infoModal}>Duração: {servicoSelecionado.duracao_min} minutos</Text>
              <Text style={estilos.infoModal}>Preço: R$ {servicoSelecionado.preco.toFixed(2)}</Text>

              <View style={estilos.botoesModal}>
                <Button
                  title="Agendar"
                  onPress={() => {
                    router.push({
                      pathname: '/agendamento',
                      params: { servico: servicoSelecionado.nome },
                    });
                    fecharModal();
                  }}
                />
                <View style={estilos.espaco} />
                <Button title="Fechar" onPress={fecharModal} color="#999" />
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  centralizado: { justifyContent: 'center', alignItems: 'center' },
  botaoVoltar: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
  textoVoltar: { fontSize: 18, color: '#007AFF' },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  botao: { padding: 15, backgroundColor: '#007AFF', marginBottom: 10, borderRadius: 5 },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  preco: { color: '#fff', fontSize: 14, marginTop: 4 },
  duracao: { color: '#e0e0e0', fontSize: 12, marginTop: 2 },
  vazio: { textAlign: 'center', color: '#666', marginTop: 50, fontSize: 16 },
  fundoModal: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  tituloModal: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  descricaoModal: { fontSize: 16, marginBottom: 10, lineHeight: 20 },
  subtituloModal: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  itemIncluso: { fontSize: 14, color: '#333', marginLeft: 10, marginBottom: 3 },
  infoModal: { fontSize: 14, marginBottom: 5, color: '#666' },
  botoesModal: { marginTop: 20 },
  espaco: { height: 10 },
});
