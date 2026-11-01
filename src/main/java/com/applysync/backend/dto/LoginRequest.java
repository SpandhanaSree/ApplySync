package com.applysync.backend.dto;

public record LoginRequest(
        String email,
        String password
) {}