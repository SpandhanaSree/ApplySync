package com.applysync.backend.dto;

public record SignupRequest(
        String name,
        String email,
        String password
) {}