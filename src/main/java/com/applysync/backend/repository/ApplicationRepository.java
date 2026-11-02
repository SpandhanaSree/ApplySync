package com.applysync.backend.repository;

import com.applysync.backend.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

import java.util.Optional;

public interface ApplicationRepository extends MongoRepository<Application, String> {

    List<Application> findByUserId(String userId);

    Optional<Application> findByIdAndUserId(String id, String userId);
}