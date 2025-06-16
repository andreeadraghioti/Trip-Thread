package com.tripthread.trip_planner.trip;

import com.tripthread.trip_planner.places.Place;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class TripResponse {
    private Long id;
    private String tripName;
    private String city;
    private LocalDateTime createdAt;
    private List<Place> places;
}
