package com.tripthread.trip_planner.user;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService service;

    @PostMapping("/profile-picture")
    public void setProfilePicture(@AuthenticationPrincipal Jwt jwt,
                                  @RequestBody PictureRequest request) {
        String userId = jwt.getSubject();
        service.saveOrUpdatePicture(userId, request.getPictureUrl());
    }

    @GetMapping("/profile-picture")
    public String getProfilePicture(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return service.getPicture(userId);
    }

    @Data
    public static class PictureRequest {
        private String pictureUrl;
    }
}
