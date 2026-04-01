package com.rms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

public class JobDTOs {

    @Data
    public static class CreateJobRequest {
        @NotBlank @Size(min = 3, message = "Title must be at least 3 characters")
        private String title;

        @NotBlank @Size(min = 20, message = "Description must be at least 20 characters")
        private String description;

        @NotNull @Size(min = 1, message = "At least one skill is required")
        private List<String> skillsRequired;

        @NotBlank(message = "Location is required")
        private String location;
    }

    @Data
    public static class UpdateJobRequest {
        private String title;
        private String description;
        private List<String> skillsRequired;
        private String location;
        private String status; // "OPEN" or "CLOSED"
    }

    @Data
    public static class JobResponse {
        private String id;
        private String title;
        private String description;
        private List<String> skillsRequired;
        private String location;
        private String status;
        private LocalDateTime postedDate;
        private String recruiterId;
        private String recruiterName;
        private String companyName;
        private int applicationCount;
    }
}
