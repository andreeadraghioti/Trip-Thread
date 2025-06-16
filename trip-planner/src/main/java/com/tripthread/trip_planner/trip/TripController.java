package com.tripthread.trip_planner.trip;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
public class TripController {
    private final TripService tripService;

    @PostMapping("/save")
    public ResponseEntity<Void> saveTrip(@RequestBody SaveTripRequest request,
                                         @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        tripService.saveTrip(userId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getUserTrips(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return ResponseEntity.ok(tripService.getTripsForUser(userId));
    }

    @GetMapping("/{id}/export-pdf")
    public ResponseEntity<byte[]> exportTripToPdf(@PathVariable Long id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Trip trip = tripService.getTripById(id, userId);
        byte[] pdfBytes = tripService.exportTripPdf(id, userId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(trip.getTripName().replaceAll("\\s+", "_") + ".pdf")
                .build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        tripService.deleteTrip(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/name")
    public ResponseEntity<Void> updateTripName(
            @PathVariable Long id,
            @RequestBody UpdateTripNameRequest request
    ) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        tripService.updateTripName(id, userId, request.getTripName());
        return ResponseEntity.noContent().build();
    }

}
