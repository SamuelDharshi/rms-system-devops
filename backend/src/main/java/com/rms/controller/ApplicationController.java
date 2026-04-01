package com.rms.controller;

import com.rms.dto.ApplicationDTOs.*;
import com.rms.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Handles all application endpoints.
 *
 * POST   /api/applications?applicantId=...           - apply for job
 * GET    /api/applications/my?applicantId=...         - applicant's applications
 * GET    /api/applications/job/{jobId}?recruiterId=.. - applicants for a job
 * PUT    /api/applications/{id}/status?recruiterId=.. - update status
 * DELETE /api/applications/{id}?applicantId=...       - withdraw
 */
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse createApplication(
            @Valid @RequestBody CreateApplicationRequest req,
            @RequestParam String applicantId) {
        return applicationService.createApplication(req, applicantId);
    }

    @GetMapping("/my")
    public List<ApplicationResponse> getMyApplications(
            @RequestParam String applicantId) {
        return applicationService.getMyApplications(applicantId);
    }

    @GetMapping("/job/{jobId}")
    public List<ApplicationResponse> getApplicationsForJob(
            @PathVariable String jobId,
            @RequestParam String recruiterId) {
        return applicationService.getApplicationsForJob(jobId, recruiterId);
    }

    @PutMapping("/{id}/status")
    public ApplicationResponse updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateStatusRequest req,
            @RequestParam String recruiterId) {
        return applicationService.updateStatus(id, req, recruiterId);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> withdraw(
            @PathVariable String id,
            @RequestParam String applicantId) {
        applicationService.withdrawApplication(id, applicantId);
        return Map.of("message", "Application withdrawn successfully");
    }
}
