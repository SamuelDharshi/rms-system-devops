package com.rms.controller;

import com.rms.dto.ProfileDTOs.*;
import com.rms.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Handles profile read and update for both roles.
 *
 * GET /api/applicants/profile?applicantId=...
 * PUT /api/applicants/profile?applicantId=...
 * GET /api/recruiters/profile?recruiterId=...
 * PUT /api/recruiters/profile?recruiterId=...
 */
@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // ── Applicant ─────────────────────────────────────────────────────────────

    @GetMapping("/api/applicants/profile")
    public ApplicantProfileResponse getApplicantProfile(
            @RequestParam String applicantId) {
        return profileService.getApplicantProfile(applicantId);
    }

    @PutMapping("/api/applicants/profile")
    public ApplicantProfileResponse updateApplicantProfile(
            @RequestParam String applicantId,
            @RequestBody UpdateApplicantProfileRequest req) {
        return profileService.updateApplicantProfile(applicantId, req);
    }

    // ── Recruiter ─────────────────────────────────────────────────────────────

    @GetMapping("/api/recruiters/profile")
    public RecruiterProfileResponse getRecruiterProfile(
            @RequestParam String recruiterId) {
        return profileService.getRecruiterProfile(recruiterId);
    }

    @PutMapping("/api/recruiters/profile")
    public RecruiterProfileResponse updateRecruiterProfile(
            @RequestParam String recruiterId,
            @RequestBody UpdateRecruiterProfileRequest req) {
        return profileService.updateRecruiterProfile(recruiterId, req);
    }
}
