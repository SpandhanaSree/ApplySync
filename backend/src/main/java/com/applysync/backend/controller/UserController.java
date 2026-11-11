
package com.applysync.backend.controller;

import com.applysync.backend.dto.ProfileResponse;
import com.applysync.backend.model.User;
import com.applysync.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal()
                .toString();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileResponse response = new ProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getPhone(),
                user.getLocation(),
                user.getCollege(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @RequestBody User updatedUser) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal()
                .toString();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updatedUser.getName());
        user.setPhone(updatedUser.getPhone());
        user.setLocation(updatedUser.getLocation());
        user.setCollege(updatedUser.getCollege());

        User savedUser = userRepository.save(user);

        ProfileResponse response = new ProfileResponse(
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getCreatedAt(),
                savedUser.getPhone(),
                savedUser.getLocation(),
                savedUser.getCollege(),
                savedUser.getRole()
        );

        return ResponseEntity.ok(response);
    }
}
