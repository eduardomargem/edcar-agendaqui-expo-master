package com.senac.demo.controller;

import com.senac.demo.model.Agendamento;
import com.senac.demo.repositories.AgendamentoRepository;
import com.senac.demo.repositories.ClienteRepository;
import com.senac.demo.repositories.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {
    
    @Autowired
    private AgendamentoRepository agendamentoRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    @Autowired
    private ServicoRepository servicoRepository;

    // GET - Listar todos os agendamentos
    @GetMapping
    public List<Agendamento> getAllAgendamentos() {
        return agendamentoRepository.findAllByOrderByDataAgendamentoDescHorarioDesc();
    }

    // GET - Buscar agendamento por ID
    @GetMapping("/{id}")
    public ResponseEntity<Agendamento> getAgendamentoById(@PathVariable Long id) {
        Optional<Agendamento> agendamento = agendamentoRepository.findById(id);
        if (agendamento.isPresent()) {
            return ResponseEntity.ok(agendamento.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Buscar agendamentos por cliente
    @GetMapping("/cliente/{clienteId}")
    public List<Agendamento> getAgendamentosByCliente(@PathVariable Long clienteId) {
        return agendamentoRepository.findByClienteIdOrderByDataAgendamentoDescHorarioDesc(clienteId);
    }

    // GET - Buscar agendamentos por data
    @GetMapping("/data/{data}")
    public List<Agendamento> getAgendamentosByData(@PathVariable String data) {
        LocalDate dataAgendamento = LocalDate.parse(data);
        return agendamentoRepository.findByDataAgendamentoOrderByHorario(dataAgendamento);
    }

    // GET - Buscar horários disponíveis para uma data
    @GetMapping("/horarios-disponiveis/{data}")
    public ResponseEntity<List<LocalTime>> getHorariosDisponiveis(@PathVariable String data) {
        LocalDate dataAgendamento = LocalDate.parse(data);
        
        // Buscar horários ocupados
        List<LocalTime> horariosOcupados = agendamentoRepository.findHorariosOcupadosByData(dataAgendamento);
        
        // Gerar lista de horários disponíveis (exemplo: das 08:00 às 18:00, de hora em hora)
        List<LocalTime> todosHorarios = List.of(
            LocalTime.of(8, 0), LocalTime.of(9, 0), LocalTime.of(10, 0),
            LocalTime.of(11, 0), LocalTime.of(12, 0), LocalTime.of(13, 0),
            LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0),
            LocalTime.of(17, 0)
        );
        
        // Filtrar horários disponíveis
        List<LocalTime> horariosDisponiveis = todosHorarios.stream()
            .filter(horario -> !horariosOcupados.contains(horario))
            .toList();
        
        return ResponseEntity.ok(horariosDisponiveis);
    }

    // GET - Verificar se horário está disponível
    @GetMapping("/verificar-disponibilidade")
    public ResponseEntity<Boolean> verificarDisponibilidade(
            @RequestParam String data, 
            @RequestParam String horario) {
        
        LocalDate dataAgendamento = LocalDate.parse(data);
        LocalTime horarioAgendamento = LocalTime.parse(horario);
        
        boolean disponivel = !agendamentoRepository.existsByDataAgendamentoAndHorario(
            dataAgendamento, horarioAgendamento);
        
        return ResponseEntity.ok(disponivel);
    }

    // POST - Criar novo agendamento
    @PostMapping
    public ResponseEntity<?> createAgendamento(@RequestBody AgendamentoRequest request) {
        // Verificar se cliente existe
        if (!clienteRepository.existsById(request.getClienteId())) {
            return ResponseEntity.badRequest().body("Cliente não encontrado");
        }
        
        // Verificar se serviço existe
        if (!servicoRepository.existsById(request.getServicoId())) {
            return ResponseEntity.badRequest().body("Serviço não encontrado");
        }
        
        // Verificar disponibilidade do horário
        if (agendamentoRepository.existsByDataAgendamentoAndHorario(
            request.getDataAgendamento(), request.getHorario())) {
            return ResponseEntity.badRequest().body("Horário já ocupado");
        }
        
        // Criar agendamento
        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(clienteRepository.findById(request.getClienteId()).get());
        agendamento.setServico(servicoRepository.findById(request.getServicoId()).get());
        agendamento.setModeloCarro(request.getModeloCarro());
        agendamento.setDataAgendamento(request.getDataAgendamento());
        agendamento.setHorario(request.getHorario());
        agendamento.setStatus("agendado");
        
        Agendamento agendamentoSalvo = agendamentoRepository.save(agendamento);
        return ResponseEntity.ok(agendamentoSalvo);
    }

    // PUT - Atualizar status do agendamento
    @PutMapping("/{id}/status")
    public ResponseEntity<Agendamento> updateStatus(
            @PathVariable Long id, 
            @RequestBody UpdateStatusRequest request) {
        
        Optional<Agendamento> agendamentoOpt = agendamentoRepository.findById(id);
        if (agendamentoOpt.isPresent()) {
            Agendamento agendamento = agendamentoOpt.get();
            agendamento.setStatus(request.getStatus());
            Agendamento agendamentoAtualizado = agendamentoRepository.save(agendamento);
            return ResponseEntity.ok(agendamentoAtualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Cancelar agendamento
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAgendamento(@PathVariable Long id) {
        Optional<Agendamento> agendamentoOpt = agendamentoRepository.findById(id);
        if (agendamentoOpt.isPresent()) {
            Agendamento agendamento = agendamentoOpt.get();
            agendamento.setStatus("cancelado");
            agendamentoRepository.save(agendamento);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Classes auxiliares para requests
    public static class AgendamentoRequest {
        private Long clienteId;
        private Long servicoId;
        private String modeloCarro;
        private LocalDate dataAgendamento;
        private LocalTime horario;
        
        // Getters e Setters
        public Long getClienteId() { return clienteId; }
        public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
        
        public Long getServicoId() { return servicoId; }
        public void setServicoId(Long servicoId) { this.servicoId = servicoId; }
        
        public String getModeloCarro() { return modeloCarro; }
        public void setModeloCarro(String modeloCarro) { this.modeloCarro = modeloCarro; }
        
        public LocalDate getDataAgendamento() { return dataAgendamento; }
        public void setDataAgendamento(LocalDate dataAgendamento) { this.dataAgendamento = dataAgendamento; }
        
        public LocalTime getHorario() { return horario; }
        public void setHorario(LocalTime horario) { this.horario = horario; }
    }

    public static class UpdateStatusRequest {
        private String status;
        
        // Getters e Setters
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}