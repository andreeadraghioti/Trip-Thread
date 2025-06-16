package com.tripthread.trip_planner.trip;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserId(String userId);
    Optional<Trip> findByIdAndUserId(Long id, String userId);
    void deleteByIdAndUserId(Long id, String userId);
    boolean existsByIdAndUserId(Long id, String userId);
}
