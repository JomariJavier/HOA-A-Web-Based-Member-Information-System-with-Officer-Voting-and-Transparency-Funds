package com.hoa.backend.publicrelations;

import com.hoa.backend.auth.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The member who submitted the complaint

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED

    @Column(columnDefinition = "TEXT")
    private String response;

    @CreationTimestamp
    private OffsetDateTime createdAt;

    private OffsetDateTime respondedAt;

    @ManyToOne
    @JoinColumn(name = "responded_by_id")
    private User respondedBy;

    private String category; // e.g., 'Maintenance', 'Security', 'Sanitation'
    private String urgency;  // e.g., 'Low', 'Medium', 'High'
}
