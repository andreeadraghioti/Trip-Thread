package com.tripthread.trip_planner.places;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Place {
    private String name;
    private String type;
    private String description;
    private String phone;
    private String website;
    private String price;
    private String address;
    private Boolean open;
}
