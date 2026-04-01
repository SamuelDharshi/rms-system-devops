package com.rms.service;

import com.rms.dto.AuthDTOs.*;
import com.rms.entity.Applicant;
import com.rms.entity.Recruiter;
import com.rms.repository.ApplicantRepository;
import com.rms.repository.RecruiterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * AuthService handles registration and login for both applicants and recruiters.
 * Service layer is used here because login logic spans two tables
 * and is reused by a single controller endpoint.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final ApplicantRepository applicantRepo;
    private final RecruiterRepository recruiterRepo;
    private final PasswordEncoder passwordEncoder;

    // ── Register Applicant ────────────────────────────────────────────────────

    public LoginResponse registerApplicant(RegisterApplicantRequest req) {
        if (applicantRepo.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        Applicant applicant = new Applicant();
        applicant.setName(req.getName());
        applicant.setEmail(req.getEmail());
        applicant.setPhone(req.getPhone());
        applicant.setPasswordHash(passwordEncoder.encode(req.getPassword()));

        Applicant saved = applicantRepo.save(applicant);

        return new LoginResponse(saved.getId(), saved.getEmail(), saved.getName(), "applicant");
    }

    // ── Register Recruiter ────────────────────────────────────────────────────

    public LoginResponse registerRecruiter(RegisterRecruiterRequest req) {
        if (recruiterRepo.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        Recruiter recruiter = new Recruiter();
        recruiter.setName(req.getName());
        recruiter.setEmail(req.getEmail());
        recruiter.setCompanyName(req.getCompanyName());
        recruiter.setPasswordHash(passwordEncoder.encode(req.getPassword()));

        Recruiter saved = recruiterRepo.save(recruiter);

        LoginResponse response = new LoginResponse(
            saved.getId(), saved.getEmail(), saved.getName(), "recruiter"
        );
        response.setCompanyName(saved.getCompanyName());
        return response;
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public LoginResponse login(LoginRequest req) {
        if ("applicant".equals(req.getRole())) {
            Applicant applicant = applicantRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid credentials"));

            if (!passwordEncoder.matches(req.getPassword(), applicant.getPasswordHash())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
            }

            return new LoginResponse(
                applicant.getId(), applicant.getEmail(), applicant.getName(), "applicant"
            );

        } else if ("recruiter".equals(req.getRole())) {
            Recruiter recruiter = recruiterRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid credentials"));

            if (!passwordEncoder.matches(req.getPassword(), recruiter.getPasswordHash())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
            }

            LoginResponse response = new LoginResponse(
                recruiter.getId(), recruiter.getEmail(), recruiter.getName(), "recruiter"
            );
            response.setCompanyName(recruiter.getCompanyName());
            return response;

        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
        }
    }
}
