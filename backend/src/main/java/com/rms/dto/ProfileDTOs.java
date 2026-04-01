package com.rms.dto;

import lombok.Data;

public class ProfileDTOs {

    @Data
    public static class UpdateApplicantProfileRequest {
        private String name;
        private String phone;
        private String profileDetails; // JSON string
    }

    @Data
    public static class UpdateRecruiterProfileRequest {
        private String name;
        private String companyName;
    }

    @Data
    public static class ApplicantProfileResponse {
        private String id;
        private String name;
        private String email;
        private String phone;
        private String profileDetails;
    }

    @Data
    public static class RecruiterProfileResponse {
        private String id;
        private String name;
        private String email;
        private String companyName;
    }
}
