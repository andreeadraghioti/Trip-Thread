package com.tripthread.trip_planner.trip;

import com.tripthread.trip_planner.places.Place;
import lombok.Data;

import java.util.List;

@Data
public class SaveTripRequest {
    private String city;
    private String tripName;
    private List<Place> places;
}
