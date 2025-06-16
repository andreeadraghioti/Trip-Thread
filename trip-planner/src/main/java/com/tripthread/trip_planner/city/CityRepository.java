package com.tripthread.trip_planner.city;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, String> {
    boolean existsByCityIgnoreCase(String city);
    City findByCityIgnoreCase(String city);
}
