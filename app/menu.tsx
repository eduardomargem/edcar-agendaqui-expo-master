import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { useAuth } from '../hooks/useAuth';

export default function Menu() {
  const router = useRouter();
  const { agendamentos, carregando, erro, cancelarAgendamento } = useAgendamentos();
  const { usuario, logout, carregando: authCarregando } = useAuth();
  const [cancelandoIds, setCancelandoIds] = useState<number[]>([]);

  const handleCancelarAgendamento = async (agendamentoId: number) => {
    console.log('🎯 CANCELANDO AGENDAMENTO - ID:', agendamentoId);
    
    // Adiciona o ID à lista de cancelamentos em andamento
    setCancelandoIds(prev => [...prev, agendamentoId]);
    
    try {
      const sucesso = await cancelarAgendamento(agendamentoId);
      
      if (sucesso) {
        console.log('✅ Agendamento cancelado com sucesso:', agendamentoId);
        // O estado já é atualizado automaticamente pelo useAgendamentos
      } else {
        console.error('❌ Falha ao cancelar agendamento:', agendamentoId);
        // Não mostra alerta de erro - o usuário pode tentar novamente
      }
    } catch (error) {
      console.error('❌ Erro ao cancelar agendamento:', error);
    } finally {
      // Remove o ID da lista de cancelamentos em andamento
      setCancelandoIds(prev => prev.filter(id => id !== agendamentoId));
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString + 'T12:00:00');
    return data.toLocaleDateString('pt-BR');
  };

  const handleLogout = async () => {
  console.log('🔄 Iniciando logout...');
  
  Alert.alert('Sair', 'Deseja realmente sair?', [
    { 
      text: 'Cancelar', 
      style: 'cancel',
      onPress: () => console.log('❌ Logout cancelado')
    },
    { 
      text: 'Sair', 
      onPress: async () => {
        console.log('✅ Usuário confirmou logout');
        
        try {
          // Executa o logout
          logout();
          console.log('✅ Logout executado com sucesso');
          
          // Aguarda um pouco para garantir que o estado foi atualizado
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Tenta várias formas de redirecionar
          console.log('🔄 Tentando redirecionar para login...');
          
          // Método 1: replace
          router.replace('/login');
          
          // Método 2: navigate (fallback)
          setTimeout(() => {
            router.navigate('/login');
          }, 100);
          
          // Método 3: window.location (para web)
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }, 200);
          
        } catch (error) {
          console.error('❌ Erro durante logout:', error);
        }
      }
    },
  ]);
};

  // Se ainda está carregando a autenticação
  if (authCarregando) {
    return (
      <View style={[estilos.fundo, estilos.centralizado]}>
        <ActivityIndicator size="large" color="#0B1F44" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  // Se não está logado (proteção adicional)
  if (!usuario) {
    return (
      <View style={[estilos.fundo, estilos.centralizado]}>
        <Text style={estilos.erro}>Usuário não logado</Text>
        <TouchableOpacity 
          style={[estilos.botao, { backgroundColor: '#0B1F44', marginTop: 20 }]} 
          onPress={() => router.replace('/login')}
        >
          <Text style={estilos.textoBotao}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={estilos.fundo}>
      <ScrollView contentContainerStyle={estilos.scrollContent}>
        <Text style={estilos.titulo}>Meu Perfil</Text>
        <Text style={estilos.usuarioInfo}>
          Olá, {usuario.nome}!
        </Text>

        <TouchableOpacity
          style={[estilos.botao, { backgroundColor: '#007AFF' }]}
          onPress={() => router.push('/comochegar')}>
          <Text style={estilos.textoBotao}>Como Chegar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.botao, { backgroundColor: '#0B1F44' }]}
          onPress={() => router.push('/servicos')}>
          <Text style={estilos.textoBotao}>Ver Serviços</Text>
        </TouchableOpacity>

        <Text style={estilos.subtitulo}>Meus Agendamentos:</Text>

        {carregando ? (
          <View style={estilos.centralizado}>
            <ActivityIndicator size="large" color="#0B1F44" />
            <Text>Carregando agendamentos...</Text>
          </View>
        ) : erro ? (
          <Text style={estilos.erro}>Erro ao carregar agendamentos: {erro}</Text>
        ) : agendamentos.length === 0 ? (
          <Text style={estilos.vazio}>Nenhum agendamento encontrado</Text>
        ) : (
          <View style={estilos.listaContainer}>
            {agendamentos.map((item) => (
              <View key={item.id.toString()} style={estilos.agendamento}>
                <Text style={estilos.servico}>{item.servico.nome}</Text>
                <Text style={estilos.info}>Data: {formatarData(item.dataAgendamento)}</Text>
                <Text style={estilos.info}>Horário: {item.horario}</Text>
                <Text style={estilos.info}>Modelo: {item.modeloCarro}</Text>
                <Text style={[
                  estilos.status,
                  item.status === 'agendado' && estilos.statusAgendado,
                  item.status === 'concluido' && estilos.statusConcluido,
                  item.status === 'cancelado' && estilos.statusCancelado
                ]}>
                  Status: {item.status}
                </Text>

                {item.status === 'agendado' && (
                  <TouchableOpacity
                    style={[
                      estilos.botaoCancelar,
                      cancelandoIds.includes(item.id) && estilos.botaoCancelando
                    ]}
                    onPress={() => handleCancelarAgendamento(item.id)}
                    disabled={cancelandoIds.includes(item.id)}
                    activeOpacity={0.7}
                  >
                    {cancelandoIds.includes(item.id) ? (
                      <View style={estilos.containerCarregando}>
                        <ActivityIndicator size="small" color="#FFF" />
                        <Text style={estilos.textoCancelar}>Cancelando...</Text>
                      </View>
                    ) : (
                      <Text style={estilos.textoCancelar}>Cancelar Agendamento</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Espaço para o botão de sair não ficar sobreposto */}
        <View style={estilos.espacoBotaoSair} />
      </ScrollView>

      {/* Botão Sair fixo na parte inferior */}
      <View style={estilos.containerBotaoSair}>
        <TouchableOpacity style={estilos.botaoSair} onPress={() => router.replace('/login')}>
        <Text style={estilos.textoBotao}>Sair da Conta</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100, // Espaço extra para o botão fixo
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#0B1F44', 
    marginBottom: 10 
  },
  usuarioInfo: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: '#666', 
    marginBottom: 20 
  },
  subtitulo: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginVertical: 15, 
    color: '#0B1F44' 
  },
  vazio: { 
    textAlign: 'center', 
    color: '#666', 
    marginTop: 50, 
    fontSize: 16 
  },
  erro: { 
    textAlign: 'center', 
    color: '#FF3B30', 
    marginTop: 50, 
    fontSize: 16 
  },
  centralizado: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 50 
  },
  botao: { 
    borderRadius: 5, 
    marginVertical: 5, 
    alignItems: 'center', 
    paddingVertical: 15 
  },
  textoBotao: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16 
  },
  listaContainer: {
    marginBottom: 20,
  },
  agendamento: { 
    padding: 15, 
    backgroundColor: '#0B1F44', 
    marginBottom: 10, 
    borderRadius: 10 
  },
  servico: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  info: { 
    color: '#fff', 
    fontSize: 14 
  },
  status: { 
    color: '#e0e0e0', 
    fontSize: 12, 
    marginTop: 5, 
    fontWeight: 'bold' 
  },
  statusAgendado: { 
    color: '#4CD964' 
  },
  statusConcluido: { 
    color: '#007AFF' 
  },
  statusCancelado: { 
    color: '#FF3B30' 
  },
  botaoCancelar: { 
    marginTop: 10, 
    backgroundColor: '#FF3B30', 
    padding: 12, 
    borderRadius: 5 
  },
  botaoCancelando: {
    backgroundColor: '#FF8A65', // Cor mais clara quando está cancelando
  },
  textoCancelar: { 
    color: '#fff', 
    fontWeight: '600', 
    textAlign: 'center',
    fontSize: 14
  },
  containerCarregando: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerBotaoSair: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  botaoSair: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  espacoBotaoSair: {
    height: 80, // Espaço reservado para o botão fixo
  },
});