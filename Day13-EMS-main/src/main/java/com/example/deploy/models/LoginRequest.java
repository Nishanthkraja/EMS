package com.example.deploy.models;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class LoginRequest {
    private String userName;
    private String password;
}
