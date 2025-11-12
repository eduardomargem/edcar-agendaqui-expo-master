package com.senac.demo.controller;

import com.senac.demo.model.Funcionario;
import com.senac.demo.repositories.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {
    
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    // GET - Listar todos os funcionários ativos
    @GetMapping
    public List<Funcionario> getAllFuncionarios() {
        return funcionarioRepository.findByAtivoTrue();
    }

    // GET - Buscar funcionário por ID
    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> getFuncionarioById(@PathVariable Long id) {
        Optional<Funcionario> funcionario = funcionarioRepository.findById(id);
        if (funcionario.isPresent() && funcionario.get().getAtivo()) {
            return ResponseEntity.ok(funcionario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Buscar funcionários por nome
    @GetMapping("/buscar")
    public List<Funcionario> getFuncionariosByNome(@RequestParam String nome) {
        return funcionarioRepository.findByNomeContainingIgnoreCase(nome);
    }

    // GET - Buscar funcionário por email
    @GetMapping("/email/{email}")
    public ResponseEntity<Funcionario> getFuncionarioByEmail(@PathVariable String email) {
        Optional<Funcionario> funcionario = funcionarioRepository.findByEmailAndAtivoTrue(email);
        if (funcionario.isPresent()) {
            return ResponseEntity.ok(funcionario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Buscar funcionário por CPF
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Funcionario> getFuncionarioByCpf(@PathVariable String cpf) {
        Optional<Funcionario> funcionario = funcionarioRepository.findByCpf(cpf);
        if (funcionario.isPresent() && funcionario.get().getAtivo()) {
            return ResponseEntity.ok(funcionario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST - Login do funcionário
    @PostMapping("/login")
    public ResponseEntity<Funcionario> loginFuncionario(@RequestBody LoginRequest loginRequest) {
        Optional<Funcionario> funcionario = funcionarioRepository.findByEmailAndSenha(
            loginRequest.getEmail(), 
            loginRequest.getSenha()
        );
        
        if (funcionario.isPresent() && funcionario.get().getAtivo()) {
            return ResponseEntity.ok(funcionario.get());
        } else {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
    }

    // POST - Verificar se email já existe
    @PostMapping("/verificar-email")
    public ResponseEntity<Boolean> verificarEmail(@RequestBody VerificarEmailRequest request) {
        boolean existe = funcionarioRepository.existsByEmail(request.getEmail());
        return ResponseEntity.ok(existe);
    }

    // POST - Verificar se CPF já existe
    @PostMapping("/verificar-cpf")
    public ResponseEntity<Boolean> verificarCpf(@RequestBody VerificarCpfRequest request) {
        boolean existe = funcionarioRepository.existsByCpf(request.getCpf());
        return ResponseEntity.ok(existe);
    }

    // Classes auxiliares para requests
    public static class LoginRequest {
        private String email;
        private String senha;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    public static class VerificarEmailRequest {
        private String email;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class VerificarCpfRequest {
        private String cpf;
        public String getCpf() { return cpf; }
        public void setCpf(String cpf) { this.cpf = cpf; }
    }
}