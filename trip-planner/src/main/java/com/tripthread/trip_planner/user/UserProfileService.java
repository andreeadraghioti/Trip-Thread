package com.tripthread.trip_planner.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserProfileRepository repository;

    public void saveOrUpdatePicture(String userId, String pictureUrl) {
        UserProfile profile = repository.findById(userId)
                .orElse(UserProfile.builder().userId(userId).build());

        profile.setPictureUrl(pictureUrl);
        repository.save(profile);
    }

    public String getPicture(String userId) {
        return repository.findById(userId)
                .map(UserProfile::getPictureUrl)
                .orElse(null);
    }
}
