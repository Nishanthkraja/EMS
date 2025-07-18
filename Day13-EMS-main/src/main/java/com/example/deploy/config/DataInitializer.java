package com.example.deploy.config;

import com.example.deploy.models.Roles;
import com.example.deploy.models.RegisterDetails;
import com.example.deploy.repository.RegisterDetailsRepository;
import com.example.deploy.repository.RolesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RegisterDetailsRepository userRepo;

    @Autowired
    private RolesRepository rolesRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create roles
        if (rolesRepo.findByRoleName("USER").isEmpty()) {
            Roles userRole = new Roles();
            userRole.setRoleName("USER");
            rolesRepo.save(userRole);
        }

        // Create test user
        if (userRepo.findByUserName("testuser").isEmpty()) {
            RegisterDetails user = new RegisterDetails();
            user.setName("Test User");
            user.setEmail("test@example.com");
            user.setUserName("testuser");
            user.setPassword(passwordEncoder.encode("password123"));

            Roles userRole = rolesRepo.findByRoleName("USER").get();
            user.setRoles(new java.util.HashSet<>(java.util.Arrays.asList(userRole)));
            
            userRepo.save(user);
        }
    }
}
