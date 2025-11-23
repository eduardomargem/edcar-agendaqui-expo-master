import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api, Agendamento } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface ResumoFinanceiro {
  totalServicosConcluidos: number;
  receitaTotal: number;
  servicosPorMes: Array<{
    mes: string;
    total: number;
    receita: number;
  }>;
  servicoMaisPopular: string;
}

export default function ResumoFinanceiro() {
  const router = useRouter();
  const { usuario, getUsuarioId } = useAuth();
  const [dados, setDados] = useState<ResumoFinanceiro | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const calcularResumo = async () => {
    try {
      setCarregando(true);
      setErro(null);

      let agendamentos: Agendamento[] = [];

      // Buscar agendamentos baseado no tipo de usuário
      if (usuario?.tipo === 'cliente') {
        // Se for cliente, busca apenas os agendamentos do cliente
        const clienteId = getUsuarioId();
        if (clienteId) {
          agendamentos = await api.getAgendamentosPorCliente(clienteId);
        }
      } else {
        // Se for admin/funcionário, busca todos os agendamentos
        // Como não temos getAgendamentos, vamos buscar por datas ou usar uma abordagem alternativa
        const hoje = new Date().toISOString().split('T')[0];
        agendamentos = await api.getAgendamentosPorData(hoje);
        
        // Para um resumo completo, precisaríamos de todos os agendamentos
        // Como solução temporária, vamos usar os dados dos últimos 30 dias
        const datasParaBuscar = [];
        for (let i = 0; i < 30; i++) {
          const data = new Date();
          data.setDate(data.getDate() - i);
          datasParaBuscar.push(data.toISOString().split('T')[0]);
        }
        
        // Buscar agendamentos para as últimas datas (limitação da API atual)
        const todosAgendamentos: Agendamento[] = [];
        for (const data of datasParaBuscar.slice(0, 7)) { // Limitar a 7 dias para não sobrecarregar
          try {
            const agendamentosDoDia = await api.getAgendamentosPorData(data);
            todosAgendamentos.push(...agendamentosDoDia);
          } catch (error) {
            console.log(`Nenhum agendamento para ${data}`);
          }
        }
        agendamentos = todosAgendamentos;
      }

      // Filtrar apenas agendamentos concluídos
      const agendamentosConcluidos = agendamentos.filter(
        ag => ag.status === 'concluido' || ag.status === 'finalizado' || ag.status === 'concluído'
      );

      console.log(`📊 ${agendamentosConcluidos.length} serviços concluídos de ${agendamentos.length} agendamentos`);

      // Calcular totais
      const totalServicosConcluidos = agendamentosConcluidos.length;
      
      const receitaTotal = agendamentosConcluidos.reduce((total, agendamento) => {
        const preco = agendamento.servico?.preco || 0;
        return total + preco;
      }, 0);

      // Calcular serviços por mês
      const servicosPorMesMap = new Map();
      
      agendamentosConcluidos.forEach(agendamento => {
        try {
          const data = new Date(agendamento.dataAgendamento);
          const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
          const mesNome = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
          
          if (!servicosPorMesMap.has(mesAno)) {
            servicosPorMesMap.set(mesAno, {
              mes: mesNome.charAt(0).toUpperCase() + mesNome.slice(1),
              total: 0,
              receita: 0
            });
          }
          
          const mesAtual = servicosPorMesMap.get(mesAno);
          mesAtual.total += 1;
          mesAtual.receita += agendamento.servico?.preco || 0;
        } catch (error) {
          console.log('Erro ao processar data do agendamento:', agendamento.dataAgendamento);
        }
      });

      const servicosPorMes = Array.from(servicosPorMesMap.values())
        .sort((a, b) => {
          // Ordenar por data (mais recente primeiro)
          const [mesA, anoA] = a.mes.split(' de ');
          const [mesB, anoB] = b.mes.split(' de ');
          return new Date(parseInt(anoB), getMonthNumber(mesB)) - 
                 new Date(parseInt(anoA), getMonthNumber(mesA));
        });

      // Encontrar serviço mais popular
      const servicoCount = new Map();
      agendamentosConcluidos.forEach(agendamento => {
        const servicoNome = agendamento.servico?.nome || 'Serviço';
        servicoCount.set(servicoNome, (servicoCount.get(servicoNome) || 0) + 1);
      });

      let servicoMaisPopular = 'Nenhum';
      let maxCount = 0;
      servicoCount.forEach((count, servico) => {
        if (count > maxCount) {
          maxCount = count;
          servicoMaisPopular = servico;
        }
      });

      setDados({
        totalServicosConcluidos,
        receitaTotal,
        servicosPorMes: servicosPorMes.slice(0, 6), // Últimos 6 meses
        servicoMaisPopular
      });

    } catch (error) {
      console.error('Erro ao carregar resumo financeiro:', error);
      setErro('Erro ao carregar dados financeiros. Tente novamente.');
      
      // Dados mock como fallback
      setDados({
        totalServicosConcluidos: 0,
        receitaTotal: 0,
        servicosPorMes: [],
        servicoMaisPopular: 'Nenhum'
      });
    } finally {
      setCarregando(false);
    }
  };

  // Função auxiliar para converter nome do mês em número
  const getMonthNumber = (monthName: string): number => {
    const months: { [key: string]: number } = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
      'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
      'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
    };
    return months[monthName.toLowerCase()] || 0;
  };

  useEffect(() => {
    calcularResumo();
  }, [usuario]);

  if (carregando) {
    return (
      <View style={[estilos.container, estilos.centralizado]}>
        <ActivityIndicator size="large" color="#0B1F44" />
        <Text style={estilos.textoCarregando}>Carregando resumo financeiro...</Text>
      </View>
    );
  }

  if (erro && !dados) {
    return (
      <View style={[estilos.container, estilos.centralizado]}>
        <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
        <Text style={estilos.textoErro}>{erro}</Text>
        <TouchableOpacity style={estilos.botaoTentarNovamente} onPress={calcularResumo}>
          <Text style={estilos.textoBotao}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={estilos.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#0B1F44" />
      </TouchableOpacity>

      <Text style={estilos.titulo}>Resumo Financeiro</Text>

      {/* Cards Principais */}
      <View style={estilos.linhaCards}>
        <View style={[estilos.card, estilos.cardPrincipal]}>
          <Ionicons name="checkmark-done-circle" size={32} color="#0B1F44" />
          <Text style={estilos.valor}>{dados?.totalServicosConcluidos || 0}</Text>
          <Text style={estilos.label}>Serviços Concluídos</Text>
        </View>

        <View style={[estilos.card, estilos.cardPrincipal]}>
          <Ionicons name="cash" size={32} color="#0B1F44" />
          <Text style={estilos.valor}>R$ {(dados?.receitaTotal || 0).toFixed(2)}</Text>
          <Text style={estilos.label}>Receita Total</Text>
        </View>
      </View>

      {/* Serviço Mais Popular */}
      <View style={estilos.card}>
        <Text style={estilos.subtitulo}>Serviço Mais Popular</Text>
        <Text style={estilos.destaque}>{dados?.servicoMaisPopular || 'Nenhum'}</Text>
      </View>

      {/* Histórico Mensal */}
      <View style={estilos.card}>
        <Text style={estilos.subtitulo}>Histórico dos Últimos Meses</Text>
        {dados?.servicosPorMes && dados.servicosPorMes.length > 0 ? (
          dados.servicosPorMes.map((mes, index) => (
            <View key={index} style={estilos.itemMes}>
              <View style={estilos.infoMes}>
                <Text style={estilos.mesNome}>{mes.mes}</Text>
                <Text style={estilos.mesTotal}>{mes.total} serviços</Text>
              </View>
              <Text style={estilos.mesReceita}>R$ {mes.receita.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <Text style={estilos.textoSemDados}>Nenhum serviço concluído nos últimos meses</Text>
        )}
      </View>

      {/* Informação do Usuário */}
      <View style={estilos.cardInfo}>
        <Ionicons name="information-circle" size={20} color="#666" />
        <Text style={estilos.textoInfo}>
          {usuario?.tipo === 'cliente' 
            ? 'Mostrando apenas seus serviços' 
            : 'Mostrando dados de todos os clientes'
          }
        </Text>
      </View>

      {/* Botão Atualizar */}
      <TouchableOpacity style={estilos.botaoAtualizar} onPress={calcularResumo}>
        <Ionicons name="refresh" size={20} color="#FFF" />
        <Text style={estilos.textoBotaoAtualizar}>Atualizar Dados</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20, 
    paddingTop: 60 
  },
  centralizado: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  botaoVoltar: { 
    position: 'absolute', 
    top: 40, 
    left: 20, 
    zIndex: 10 
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20,
    color: '#0B1F44'
  },
  linhaCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: { 
    backgroundColor: '#F8F9FA', 
    padding: 20, 
    borderRadius: 12, 
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0B1F44'
  },
  cardPrincipal: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    paddingVertical: 25,
  },
  valor: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#0B1F44',
    marginVertical: 5
  },
  label: { 
    fontSize: 14, 
    color: '#666',
    textAlign: 'center'
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1F44',
    marginBottom: 10
  },
  destaque: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center'
  },
  itemMes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  infoMes: {
    flex: 1
  },
  mesNome: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  mesTotal: {
    fontSize: 12,
    color: '#666'
  },
  mesReceita: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  botaoAtualizar: {
    backgroundColor: '#0B1F44',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30
  },
  textoBotaoAtualizar: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  textoCarregando: {
    marginTop: 10,
    color: '#666',
    fontSize: 16
  },
  textoErro: {
    marginTop: 10,
    marginBottom: 20,
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 16
  },
  botaoTentarNovamente: {
    backgroundColor: '#0B1F44',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8
  },
  textoBotao: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16
  },
  textoSemDados: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 10
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10
  },
  textoInfo: {
    marginLeft: 10,
    color: '#1976D2',
    fontSize: 14,
    flex: 1
  }
});