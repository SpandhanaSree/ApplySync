
package com.applysync.backend.dto;

import java.time.LocalDateTime;

public class ProfileResponse {

    private String name;
    private String email;
    private LocalDateTime createdAt;
    private String phone;
    private String location;
    private String college;
    private String role;

    public ProfileResponse(
            String name,
            String email,
            LocalDateTime createdAt,
            String phone,
            String location,
            String college,
            String role
    ) {
        this.name = name;
        this.email = email;
        this.createdAt = createdAt;
        this.phone = phone;
        this.location = location;
        this.college = college;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getPhone() {
        return phone;
    }

    public String getLocation() {
        return location;
    }

    public String getCollege() {
        return college;
    }

    public String getRole() {
        return role;
    }
}
