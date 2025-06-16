package com.tripthread.trip_planner.places;

import lombok.Data;

import java.util.List;

@Data
public class PlacesRequest {
    private List<String> activities;
    private String city;
    private String group;
    private String budget;
}