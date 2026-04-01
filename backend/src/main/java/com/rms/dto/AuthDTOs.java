package com.rms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

// ─── Auth DTOs ────────────────────────────────────────────────────────────────

public class AuthDTOs {

    @Data
    public static class RegisterApplicantRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank @Email(message = "Valid email is required")
        private String email;

        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        private String phone;
    }

    @Data
    public static class RegisterRecruiterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank @Email(message = "Valid email is required")
        private String email;

        @NotBlank(message = "Company name is required")
        private String companyName;

        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        private String password;

        // "applicant" or "recruiter"
        @NotBlank
        private String role;
    }

    @Data
    public static class LoginResponse {
        private String id;
        private String email;
        private String name;
        private String role;
        private String companyName; // only for recruiters

        public LoginResponse(String id, String email, String name, String role) {
            this.id    = id;
            this.email = email;
            this.name  = name;
            this.role  = role;
        }
    }
}
