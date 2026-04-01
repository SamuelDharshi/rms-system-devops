package com.rms.service;

import com.rms.dto.ApplicationDTOs.*;
import com.rms.entity.Application;
import com.rms.entity.Application.ApplicationStatus;
import com.rms.entity.Applicant;
import com.rms.entity.Job;
import com.rms.entity.Job.JobStatus;
import com.rms.repository.ApplicationRepository;
import com.rms.repository.ApplicantRepository;
import com.rms.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ApplicationService handles all application business logic:
 * - Duplicate check
 * - Job open/closed check
 * - Ownership check for status updates
 */
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepo;
    private final ApplicantRepository   applicantRepo;
    private final JobRepository         jobRepo;

    // ── Apply for a job ───────────────────────────────────────────────────────

    public ApplicationResponse createApplication(
            CreateApplicationRequest req, String applicantId) {

        // Check job exists and is still open
        Job job = jobRepo.findById(req.getJobId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Job not found"));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "This job is no longer accepting applications");
        }

        // Prevent duplicate applications
        if (applicationRepo.existsByApplicantIdAndJobId(applicantId, req.getJobId())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "You have already applied for this job");
        }

        Applicant applicant = applicantRepo.findById(applicantId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Applicant not found"));

        Application application = new Application();
        application.setApplicant(applicant);
        application.setJob(job);
        application.setCoverLetter(req.getCoverLetter());
        application.setApplicationStatus(ApplicationStatus.PENDING);

        return toResponse(applicationRepo.save(application));
    }

    // ── Get applicant's own applications ──────────────────────────────────────

    public List<ApplicationResponse> getMyApplications(String applicantId) {
        return applicationRepo
            .findByApplicantIdOrderByApplicationDateDesc(applicantId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Get all applicants for a job (recruiter) ──────────────────────────────

    public List<ApplicationResponse> getApplicationsForJob(
            String jobId, String recruiterId) {

        Job job = jobRepo.findById(jobId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Job not found"));

        if (!job.getRecruiter().getId().equals(recruiterId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "You do not own this job listing");
        }

        return applicationRepo
            .findByJobIdOrderByApplicationDateAsc(jobId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Update application status (recruiter) ─────────────────────────────────

    public ApplicationResponse updateStatus(
            String applicationId, UpdateStatusRequest req, String recruiterId) {

        Application application = applicationRepo.findById(applicationId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Application not found"));

        // Only the recruiter who owns the job can update status
        if (!application.getJob().getRecruiter().getId().equals(recruiterId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "You are not authorised to update this application");
        }

        application.setApplicationStatus(
            ApplicationStatus.valueOf(req.getApplicationStatus()));

        return toResponse(applicationRepo.save(application));
    }

    // ── Withdraw application (applicant) ──────────────────────────────────────

    public void withdrawApplication(String applicationId, String applicantId) {
        Application application = applicationRepo.findById(applicationId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Application not found"));

        if (!application.getApplicant().getId().equals(applicantId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "You do not own this application");
        }

        applicationRepo.delete(application);
    }

    // ── Helper: entity → response DTO ────────────────────────────────────────

    private ApplicationResponse toResponse(Application a) {
        ApplicationResponse r = new ApplicationResponse();
        r.setId(a.getId());
        r.setApplicationDate(a.getApplicationDate());
        r.setApplicationStatus(a.getApplicationStatus().name());
        r.setCoverLetter(a.getCoverLetter());

        // Job info
        r.setJobId(a.getJob().getId());
        r.setJobTitle(a.getJob().getTitle());
        r.setJobLocation(a.getJob().getLocation());
        r.setJobStatus(a.getJob().getStatus().name());
        r.setCompanyName(a.getJob().getRecruiter().getCompanyName());

        // Applicant info
        r.setApplicantId(a.getApplicant().getId());
        r.setApplicantName(a.getApplicant().getName());
        r.setApplicantEmail(a.getApplicant().getEmail());
        r.setApplicantPhone(a.getApplicant().getPhone());

        return r;
    }
}
