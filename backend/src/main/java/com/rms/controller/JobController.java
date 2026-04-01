package com.rms.controller;

import com.rms.dto.JobDTOs.*;
import com.rms.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Handles all job listing endpoints.
 *
 * GET    /api/jobs                       - all open jobs (public, with optional filters)
 * GET    /api/jobs/{id}                  - single job (public)
 * GET    /api/jobs/recruiter/my?id=...   - recruiter's own jobs
 * POST   /api/jobs?recruiterId=...       - create job
 * PUT    /api/jobs/{id}?recruiterId=...  - update job
 * DELETE /api/jobs/{id}?recruiterId=...  - delete job
 *
 * Since there is no JWT, the caller passes their ID as a query parameter.
 * The frontend stores the user ID in localStorage after login.
 */
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // ── Public endpoints ──────────────────────────────────────────────────────

    @GetMapping
    public List<JobResponse> getAllJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String skill) {
        return jobService.getAllJobs(keyword, location, skill);
    }

    @GetMapping("/{id}")
    public JobResponse getJob(@PathVariable String id) {
        return jobService.getJob(id);
    }

    // ── Recruiter endpoints ───────────────────────────────────────────────────

    @GetMapping("/recruiter/my")
    public List<JobResponse> getMyJobs(@RequestParam String recruiterId) {
        return jobService.getRecruiterJobs(recruiterId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobResponse createJob(
            @Valid @RequestBody CreateJobRequest req,
            @RequestParam String recruiterId) {
        return jobService.createJob(req, recruiterId);
    }

    @PutMapping("/{id}")
    public JobResponse updateJob(
            @PathVariable String id,
            @RequestBody UpdateJobRequest req,
            @RequestParam String recruiterId) {
        return jobService.updateJob(id, req, recruiterId);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteJob(
            @PathVariable String id,
            @RequestParam String recruiterId) {
        jobService.deleteJob(id, recruiterId);
        return Map.of("message", "Job deleted successfully");
    }
}
