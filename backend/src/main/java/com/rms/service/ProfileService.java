package com.rms.service;

import com.rms.dto.ProfileDTOs.*;
import com.rms.entity.Applicant;
import com.rms.entity.Recruiter;
import com.rms.repository.ApplicantRepository;
import com.rms.repository.RecruiterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * ProfileService handles profile reads and updates for both roles.
 * Centralised here since the pattern is identical for both entity types.
 */
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ApplicantRepository applicantRepo;
    private final RecruiterRepository recruiterRepo;

    // ── Applicant Profile ─────────────────────────────────────────────────────

    public ApplicantProfileResponse getApplicantProfile(String applicantId) {
        Applicant a = applicantRepo.findById(applicantId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Applicant not found"));
        return toApplicantResponse(a);
    }

    public ApplicantProfileResponse updateApplicantProfile(
            String applicantId, UpdateApplicantProfileRequest req) {

        Applicant a = applicantRepo.findById(applicantId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Applicant not found"));

        if (req.getName()           != null) a.setName(req.getName());
        if (req.getPhone()          != null) a.setPhone(req.getPhone());
        if (req.getProfileDetails() != null) a.setProfileDetails(req.getProfileDetails());

        return toApplicantResponse(applicantRepo.save(a));
    }

    // ── Recruiter Profile ─────────────────────────────────────────────────────

    public RecruiterProfileResponse getRecruiterProfile(String recruiterId) {
        Recruiter r = recruiterRepo.findById(recruiterId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Recruiter not found"));
        return toRecruiterResponse(r);
    }

    public RecruiterProfileResponse updateRecruiterProfile(
            String recruiterId, UpdateRecruiterProfileRequest req) {

        Recruiter r = recruiterRepo.findById(recruiterId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Recruiter not found"));

        if (req.getName()        != null) r.setName(req.getName());
        if (req.getCompanyName() != null) r.setCompanyName(req.getCompanyName());

        return toRecruiterResponse(recruiterRepo.save(r));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private ApplicantProfileResponse toApplicantResponse(Applicant a) {
        ApplicantProfileResponse r = new ApplicantProfileResponse();
        r.setId(a.getId());
        r.setName(a.getName());
        r.setEmail(a.getEmail());
        r.setPhone(a.getPhone());
        r.setProfileDetails(a.getProfileDetails());
        return r;
    }

    private RecruiterProfileResponse toRecruiterResponse(Recruiter rec) {
        RecruiterProfileResponse r = new RecruiterProfileResponse();
        r.setId(rec.getId());
        r.setName(rec.getName());
        r.setEmail(rec.getEmail());
        r.setCompanyName(rec.getCompanyName());
        return r;
    }
}
