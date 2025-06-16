package com.tripthread.trip_planner.trip;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class  Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String tripName;
    private String city;
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String places;
}
