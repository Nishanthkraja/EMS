package com.example.deploy.repository;

import com.example.deploy.models.RegisterDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegisterDetailsRepository extends JpaRepository<RegisterDetails, Integer> {
    Optional<RegisterDetails> findByUserName(String userName);
    Optional<RegisterDetails> findByEmail(String email);
}
