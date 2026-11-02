package com.applysync.backend.service;

import com.applysync.backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import com.applysync.backend.model.Application;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Application createApplication(Application application) {
        application.setCreatedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByUser(String userId) {
        return applicationRepository.findByUserId(userId);
    }

    public Application getApplicationById(String id, String userId) {
        return applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public Application updateApplication(String id, String userId, Application updatedApplication){

        Application existingApplication = getApplicationById(id, userId);

        existingApplication.setCompany(updatedApplication.getCompany());
        existingApplication.setRole(updatedApplication.getRole());
        existingApplication.setJobUrl(updatedApplication.getJobUrl());
        existingApplication.setPlatform(updatedApplication.getPlatform());
        existingApplication.setAppliedDate(updatedApplication.getAppliedDate());
        existingApplication.setDeadline(updatedApplication.getDeadline());
        existingApplication.setStatus(updatedApplication.getStatus());
        existingApplication.setInterviewDate(updatedApplication.getInterviewDate());
        existingApplication.setNotes(updatedApplication.getNotes());

        existingApplication.setUpdatedAt(LocalDateTime.now());

        return applicationRepository.save(existingApplication);
    }

    public void deleteApplication(String id, String userId) {
        Application application = getApplicationById(id, userId);
        applicationRepository.delete(application);
    }
}