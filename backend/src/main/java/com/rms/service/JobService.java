package com.rms.service;

import com.rms.dto.JobDTOs.*;
import com.rms.entity.Job;
import com.rms.entity.Job.JobStatus;
import com.rms.entity.Recruiter;
import com.rms.repository.JobRepository;
import com.rms.repository.RecruiterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * JobService handles all job-related business logic.
 * Separates complex mapping and validation from the controller.
 */
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository     jobRepo;
    private final RecruiterRepository recruiterRepo;

    // ── Create Job ────────────────────────────────────────────────────────────

    public JobResponse createJob(CreateJobRequest req, String recruiterId) {
        Recruiter recruiter = recruiterRepo.findById(recruiterId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Recruiter not found"));

        Job job = new Job();
        job.setTitle(req.getTitle());
        job.setDescription(req.getDescription());
        job.setSkillsRequired(String.join(",", req.getSkillsRequired()));
        job.setLocation(req.getLocation());
        job.setStatus(JobStatus.OPEN);
        job.setRecruiter(recruiter);

        return toResponse(jobRepo.save(job));
    }

    // ── Get All Open Jobs (with optional search) ──────────────────────────────

    public List<JobResponse> getAllJobs(String keyword, String location, String skill) {
        boolean hasFilter = keyword != null || location != null || skill != null;

        List<Job> jobs = hasFilter
            ? jobRepo.searchJobs(keyword, location, skill)
            : jobRepo.findByStatusOrderByPostedDateDesc(JobStatus.OPEN);

        return jobs.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Get Single Job ────────────────────────────────────────────────────────

    public JobResponse getJob(String id) {
        Job job = jobRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Job not found"));
        return toResponse(job);
    }

    // ── Get Recruiter's Own Jobs ──────────────────────────────────────────────

    public List<JobResponse> getRecruiterJobs(String recruiterId) {
        return jobRepo.findByRecruiterIdOrderByPostedDateDesc(recruiterId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Update Job ────────────────────────────────────────────────────────────

    public JobResponse updateJob(String id, UpdateJobRequest req, String recruiterId) {
        Job job = getOwnedJob(id, recruiterId);

        if (req.getTitle()          != null) job.setTitle(req.getTitle());
        if (req.getDescription()    != null) job.setDescription(req.getDescription());
        if (req.getLocation()       != null) job.setLocation(req.getLocation());
        if (req.getSkillsRequired() != null)
            job.setSkillsRequired(String.join(",", req.getSkillsRequired()));
        if (req.getStatus()         != null)
            job.setStatus(JobStatus.valueOf(req.getStatus()));

        return toResponse(jobRepo.save(job));
    }

    // ── Delete Job ────────────────────────────────────────────────────────────

    public void deleteJob(String id, String recruiterId) {
        Job job = getOwnedJob(id, recruiterId);
        jobRepo.delete(job);
    }

    // ── Helper: verify ownership ──────────────────────────────────────────────

    private Job getOwnedJob(String jobId, String recruiterId) {
        Job job = jobRepo.findById(jobId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Job not found"));
        if (!job.getRecruiter().getId().equals(recruiterId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "You do not own this job listing");
        }
        return job;
    }

    // ── Helper: entity → response DTO ────────────────────────────────────────

    public JobResponse toResponse(Job job) {
        JobResponse r = new JobResponse();
        r.setId(job.getId());
        r.setTitle(job.getTitle());
        r.setDescription(job.getDescription());
        r.setLocation(job.getLocation());
        r.setStatus(job.getStatus().name());
        r.setPostedDate(job.getPostedDate());
        r.setRecruiterId(job.getRecruiter().getId());
        r.setRecruiterName(job.getRecruiter().getName());
        r.setCompanyName(job.getRecruiter().getCompanyName());
        r.setApplicationCount(
            job.getApplications() != null ? job.getApplications().size() : 0
        );

        // Convert comma-separated string back to list
        if (job.getSkillsRequired() != null && !job.getSkillsRequired().isBlank()) {
            r.setSkillsRequired(
                Arrays.asList(job.getSkillsRequired().split(","))
            );
        } else {
            r.setSkillsRequired(List.of());
        }

        return r;
    }
}
