package com.rms.repository;

import com.rms.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {

    // All applications submitted by one applicant
    List<Application> findByApplicantIdOrderByApplicationDateDesc(String applicantId);

    // All applications for a specific job
    List<Application> findByJobIdOrderByApplicationDateAsc(String jobId);

    // Check for duplicate application
    boolean existsByApplicantIdAndJobId(String applicantId, String jobId);

    // Find specific application by applicant + job
    Optional<Application> findByApplicantIdAndJobId(String applicantId, String jobId);
}
