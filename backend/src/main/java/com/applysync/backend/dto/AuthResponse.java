package com.applysync.backend.dto;

public record AuthResponse(
        String token,
        String message
) {}