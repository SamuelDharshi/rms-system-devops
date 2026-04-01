package com.rms.repository;

import com.rms.entity.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Spring Data JPA repository for Applicant.
 * All basic CRUD methods are auto-generated — no SQL needed.
 */
@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, String> {

    Optional<Applicant> findByEmail(String email);

    boolean existsByEmail(String email);
}
