package com.rms.controller;

import com.rms.dto.AuthDTOs.*;
import com.rms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Handles registration and login for applicants and recruiters.
 *
 * POST /api/auth/applicant/register
 * POST /api/auth/recruiter/register
 * POST /api/auth/login
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/applicant/register")
    @ResponseStatus(HttpStatus.CREATED)
    public LoginResponse registerApplicant(
            @Valid @RequestBody RegisterApplicantRequest req) {
        return authService.registerApplicant(req);
    }

    @PostMapping("/recruiter/register")
    @ResponseStatus(HttpStatus.CREATED)
    public LoginResponse registerRecruiter(
            @Valid @RequestBody RegisterRecruiterRequest req) {
        return authService.registerRecruiter(req);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }
}
