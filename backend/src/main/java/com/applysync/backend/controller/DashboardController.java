package com.applysync.backend.controller;

import com.applysync.backend.service.DashboardService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public Map<String, Object> getDashboardStats() {

        String userId = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return dashboardService.getDashboardStats(userId);
    }
}