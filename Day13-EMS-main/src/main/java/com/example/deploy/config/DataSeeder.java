package com.example.deploy.config;

import com.example.deploy.models.Roles;
import com.example.deploy.repository.RolesRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RolesRepository rolesRepo;

    public DataSeeder(RolesRepository rolesRepo) {
        this.rolesRepo = rolesRepo;
    }

    @Override
    public void run(String... args) {
        createRoleIfMissing("USER");
        createRoleIfMissing("ADMIN");
    }

    private void createRoleIfMissing(String roleName) {
        rolesRepo.findByRoleName(roleName).orElseGet(() -> {
            Roles r = new Roles();
            r.setRoleName(roleName);
            return rolesRepo.save(r);
        });
    }
}
