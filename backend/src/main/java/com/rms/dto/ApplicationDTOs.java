package com.rms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

public class ApplicationDTOs {

    @Data
    public static class CreateApplicationRequest {
        @NotBlank(message = "Job ID is required")
        private String jobId;

        private String coverLetter;
    }

    @Data
    public static class UpdateStatusRequest {
        @NotBlank
        @Pattern(regexp = "PENDING|SELECTED|REJECTED",
                 message = "Status must be PENDING, SELECTED, or REJECTED")
        private String applicationStatus;
    }

    @Data
    public static class ApplicationResponse {
        private String id;
        private LocalDateTime applicationDate;
        private String applicationStatus;
        private String coverLetter;

        // Job info
        private String jobId;
        private String jobTitle;
        private String jobLocation;
        private String jobStatus;
        private String companyName;

        // Applicant info (shown to recruiter)
        private String applicantId;
        private String applicantName;
        private String applicantEmail;
        private String applicantPhone;
    }
}
