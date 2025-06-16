package com.tripthread.trip_planner.trip;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.tripthread.trip_planner.places.Place;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final ObjectMapper objectMapper;

    public void saveTrip(String userId, SaveTripRequest request) {
        try{
            String json = objectMapper.writeValueAsString(request.getPlaces());

            Trip trip = Trip.builder()
                    .userId(userId)
                    .tripName(request.getTripName() != null ? request.getTripName() : request.getCity() + " trip")
                    .city(request.getCity())
                    .createdAt(LocalDateTime.now())
                    .places(json)
                    .build();

            tripRepository.save(trip);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<TripResponse> getTripsForUser(String userId) {
        List<Trip> trips = tripRepository.findByUserId(userId);
        return trips.stream().map(trip -> {
            try {
                List<Place> places = objectMapper.readValue(trip.getPlaces(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, Place.class));
                return new TripResponse(trip.getId(), trip.getTripName(), trip.getCity(), trip.getCreatedAt(), places);
            } catch (Exception e) {
                throw new RuntimeException("Failed to deserialize places", e);
            }
        }).toList();
    }

    public Trip getTripById(Long id, String userId) {
        return tripRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Trip not found or access denied"));
    }

    public byte[] exportTripPdf(Long id, String userId) {
        Trip trip = getTripById(id, userId);
        return generateTripPdf(trip);
    }

    public byte[] generateTripPdf(Trip trip) {
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph(trip.getTripName(), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            String capitalizedCity = trip.getCity().substring(0, 1).toUpperCase() + trip.getCity().substring(1).toLowerCase();
            String headerLine = capitalizedCity + " " + trip.getCreatedAt().getYear();
            Font subtitleFont = new Font(Font.HELVETICA, 12, Font.NORMAL);
            Paragraph subtitle = new Paragraph(headerLine, subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            Font sectionTitleFont = new Font(Font.HELVETICA, 14, Font.BOLD);
            Paragraph recHeader = new Paragraph("Recommendations:", sectionTitleFont);
            recHeader.setSpacingAfter(10);
            document.add(recHeader);

            ObjectMapper mapper = new ObjectMapper();
            List<Place> places = mapper.readValue(trip.getPlaces(),
                    mapper.getTypeFactory().constructCollectionType(List.class, Place.class));

            Font placeFont = new Font(Font.HELVETICA, 11, Font.NORMAL);

            for (Place place : places) {
                Paragraph p = new Paragraph("• " + place.getName(), placeFont);
                p.setSpacingBefore(5);
                document.add(p);

                if (place.getDescription() != null && !place.getDescription().isEmpty()) {
                    document.add(new Paragraph("    " + place.getDescription(), placeFont));
                }
                if (place.getPhone() != null && !place.getPhone().isEmpty()) {
                    document.add(new Paragraph("    Phone: " + place.getPhone(), placeFont));
                }
                if (place.getAddress() != null && !place.getAddress().isEmpty()) {
                    document.add(new Paragraph("    Address: " + place.getAddress(), placeFont));
                }
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    @Transactional
    public void deleteTrip(Long id, String userId) {
        boolean exists = tripRepository.existsByIdAndUserId(id, userId);
        if (!exists) {
            throw new RuntimeException("Trip not found or access denied");
        }
        tripRepository.deleteByIdAndUserId(id, userId);
    }

    @Transactional
    public void updateTripName(Long id, String userId, String newName) {
        Trip trip = tripRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Trip not found or access denied"));

        trip.setTripName(newName);
        tripRepository.save(trip);
    }

}
