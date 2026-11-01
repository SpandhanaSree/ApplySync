package com.applysync.backend.service;

import com.applysync.backend.dto.SignupRequest;
import com.applysync.backend.dto.LoginRequest;
import com.applysync.backend.dto.AuthResponse;
import com.applysync.backend.model.User;
import com.applysync.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already registered");
        }

        String hashedPassword = passwordEncoder.encode(request.password());

        User user = new User(
                request.name(),
                request.email(),
                hashedPassword
        );

        userRepository.save(user);

        return new AuthResponse(null, "Signup successful");
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        return new AuthResponse(null, "Login successful");
    }
}