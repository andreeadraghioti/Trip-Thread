package com.tripthread.trip_planner.places;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripthread.trip_planner.city.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlacesService {
    private final ObjectMapper objectMapper;
    private final CityRepository cityRepository;

    public List<Place> getRecommendations(PlacesRequest request) {

        if (!cityRepository.existsByCityIgnoreCase(request.getCity())) {
            throw new IllegalArgumentException("City not found");
        }

        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "python",
                    "final_script.py",
                    String.join(",", request.getActivities()),
                    request.getCity(),
                    request.getGroup(),
                    request.getBudget()
            );
            pb.directory(new File("python_scripts"));
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder jsonOutput = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonOutput.append(line);
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("Python script failed");
            }

            return objectMapper.readValue(jsonOutput.toString(), new TypeReference<>() {
            });

        } catch (Exception e) {
            throw new RuntimeException("Error during place recommendation", e);
        }
    }
}