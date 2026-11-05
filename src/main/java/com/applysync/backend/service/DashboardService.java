package com.applysync.backend.service;

import com.applysync.backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.HashMap;

@Service
public class DashboardService {

    private final ApplicationRepository applicationRepository;

    public DashboardService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Map<String, Object> getDashboardStats(String userId) {

        var applications = applicationRepository.findByUserId(userId);

        long totalApplications = applications.size();

        long applied = applications.stream()
                .filter(app -> "APPLIED".equalsIgnoreCase(app.getStatus()))
                .count();

        long interviews = applications.stream()
                .filter(app -> "INTERVIEW".equalsIgnoreCase(app.getStatus()))
                .count();

        long offers = applications.stream()
                .filter(app -> "OFFER".equalsIgnoreCase(app.getStatus()))
                .count();

        long rejected = applications.stream()
                .filter(app -> "REJECTED".equalsIgnoreCase(app.getStatus()))
                .count();

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalApplications", totalApplications);
        stats.put("applied", applied);
        stats.put("interviews", interviews);
        stats.put("offers", offers);
        stats.put("rejected", rejected);

        return stats;
    }
}