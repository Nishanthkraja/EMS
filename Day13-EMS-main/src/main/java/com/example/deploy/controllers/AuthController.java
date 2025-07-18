package com.example.deploy.controllers;

import com.example.deploy.models.*;
import com.example.deploy.services.AuthService;
import com.example.deploy.repository.RegisterDetailsRepository;
import com.example.deploy.repository.RolesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService svc;
    @Autowired
    private RegisterDetailsRepository userRepo;
    @Autowired
    private RolesRepository rolesRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/test")
    public String test() {
        return "Auth service is up!";
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDetailsDto dto) {
        try {
            if (userRepo.findByUserName(dto.getUserName()).isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }

            if (dto.getRoleNames() == null || dto.getRoleNames().isEmpty()) {
                return ResponseEntity.badRequest().body("At least one role must be provided");
            }

            RegisterDetails user = new RegisterDetails();
            user.setName(dto.getName());
            user.setEmail(dto.getEmail());
            user.setUserName(dto.getUserName());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));

            Set<Roles> roles = new HashSet<>();
            boolean validRoleFound = false;
            for (String roleName : dto.getRoleNames()) {
                Roles role = rolesRepo.findByRoleName(roleName)
                    .orElse(null);
                if (role != null) {
                    roles.add(role);
                    validRoleFound = true;
                }
            }

            if (!validRoleFound) {
                return ResponseEntity.badRequest().body("No valid roles found");
            }

            user.setRoles(roles);
            userRepo.save(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest req) {
        return svc.login(req);
    }
}
