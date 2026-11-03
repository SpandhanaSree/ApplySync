package com.applysync.backend.controller;

import com.applysync.backend.service.ApplicationService;
import org.springframework.web.bind.annotation.*;

import com.applysync.backend.model.Application;

import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public Application createApplication(@RequestBody Application application) {
        String userId = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        application.setUserId(userId);

        return applicationService.createApplication(application);
    }

    @GetMapping
    public List<Application> getMyApplications() {

        String userId = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return applicationService.getApplicationsByUser(userId);
    }

    @GetMapping("/{id}")
    public Application getApplicationById(@PathVariable String id) {

        String userId = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return applicationService.getApplicationById(id, userId);
    }

    @PutMapping("/{id}")
    public Application updateApplication(
            @PathVariable String id,
            @RequestBody Application application) {

        String userId = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return applicationService.updateApplication(id, userId, application);
    }

    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable String id) {

        String userId = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        applicationService.deleteApplication(id, userId);

        return "Application deleted successfully";
    }

}