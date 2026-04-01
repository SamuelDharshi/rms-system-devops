package com.rms.repository;

import com.rms.entity.Job;
import com.rms.entity.Job.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {

    // All open jobs
    List<Job> findByStatusOrderByPostedDateDesc(JobStatus status);

    // All jobs by a specific recruiter
    List<Job> findByRecruiterIdOrderByPostedDateDesc(String recruiterId);

    // Search open jobs by keyword (title or description) with optional location filter
    @Query("""
        SELECT j FROM Job j
        WHERE j.status = 'OPEN'
          AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:skill IS NULL OR LOWER(j.skillsRequired) LIKE LOWER(CONCAT('%', :skill, '%')))
        ORDER BY j.postedDate DESC
    """)
    List<Job> searchJobs(
        @Param("keyword")  String keyword,
        @Param("location") String location,
        @Param("skill")    String skill
    );
}
