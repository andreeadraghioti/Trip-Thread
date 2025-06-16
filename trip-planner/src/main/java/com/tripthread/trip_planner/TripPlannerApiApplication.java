package com.tripthread.trip_planner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
public class TripPlannerApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(TripPlannerApiApplication.class, args);
	}

}
