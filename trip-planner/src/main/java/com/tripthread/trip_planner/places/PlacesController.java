package com.tripthread.trip_planner.places;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/places")
@RequiredArgsConstructor
public class PlacesController {
    private final PlacesService placesService;

    @PostMapping("/recommend")
    public ResponseEntity<List<Place>> recommendPlaces(@RequestBody PlacesRequest request) {
        List<Place> recommendations = placesService.getRecommendations(request);
        return ResponseEntity.ok(recommendations);
    }
}
