package com.rms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Maps to the `applications` table in MySQL.
 * Junction between Applicant and Job.
 */
@Entity
@Table(
    name = "applications",
    // Unique constraint: one applicant can only apply once per job
    uniqueConstraints = @UniqueConstraint(columnNames = {"applicant_id", "job_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "application_date", nullable = false, updatable = false)
    private LocalDateTime applicationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "application_status", nullable = false)
    private ApplicationStatus applicationStatus = ApplicationStatus.PENDING;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Many applications → one applicant
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "applicant_id", nullable = false)
    private Applicant applicant;

    // Many applications → one job
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @PrePersist
    protected void onCreate() {
        applicationDate = LocalDateTime.now();
        updatedAt       = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ApplicationStatus {
        PENDING, SELECTED, REJECTED
    }
}
