package com.rms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration.
 * - Disables Spring Security's default login page and CSRF protection.
 * - Permits ALL requests (authentication is handled manually in controllers).
 * - Provides BCryptPasswordEncoder bean for password hashing.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Open up all endpoints — no JWT, no session, no role checks.
     * Authentication is handled manually in AuthController.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    /**
     * BCrypt password encoder — used in AuthService to hash and verify passwords.
     * Strength 12 = 2^12 hashing rounds (same as the NestJS version).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
