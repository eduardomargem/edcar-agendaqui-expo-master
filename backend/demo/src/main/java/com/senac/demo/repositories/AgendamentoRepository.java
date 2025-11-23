package com.senac.demo.repositories;

import com.senac.demo.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    
    // Buscar agendamentos por cliente
    List<Agendamento> findByClienteIdOrderByDataAgendamentoDescHorarioDesc(Long clienteId);
    
    // Buscar agendamentos por data
    List<Agendamento> findByDataAgendamentoOrderByHorario(LocalDate dataAgendamento);
    
    // Buscar agendamentos por status
    List<Agendamento> findByStatusOrderByDataAgendamentoAscHorarioAsc(String status);
    
    // Buscar agendamentos por cliente e status
    List<Agendamento> findByClienteIdAndStatusOrderByDataAgendamentoDesc(Long clienteId, String status);
    
    // Buscar agendamento por data e horário específico
    Optional<Agendamento> findByDataAgendamentoAndHorario(LocalDate dataAgendamento, LocalTime horario);
    
    // Verificar se existe agendamento em uma data e horário específico
    boolean existsByDataAgendamentoAndHorario(LocalDate dataAgendamento, LocalTime horario);
    
    // Buscar horários ocupados em uma data específica
    @Query("SELECT a.horario FROM Agendamento a WHERE a.dataAgendamento = :data AND a.status != 'cancelado'")
    List<LocalTime> findHorariosOcupadosByData(LocalDate data);
    
    // Buscar agendamentos ordenados por data (mais recentes primeiro)
    List<Agendamento> findAllByOrderByDataAgendamentoDescHorarioDesc();
    
    // Buscar agendamentos por período
    List<Agendamento> findByDataAgendamentoBetweenOrderByDataAgendamentoAscHorarioAsc(
        LocalDate dataInicio, LocalDate dataFim);
}