package com.tripthread.trip_planner.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class BeansConfig {
    @Bean
    public ApplicationAuditAware auditorAware() {
        return new ApplicationAuditAware();
    }

}
