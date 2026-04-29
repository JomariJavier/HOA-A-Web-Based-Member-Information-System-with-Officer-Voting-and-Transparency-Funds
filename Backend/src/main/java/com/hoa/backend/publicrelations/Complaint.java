package com.hoa.backend.publicrelations;

import com.hoa.backend.auth.User;
import com.hoa.backend.member.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Links to the members table via member_id (BigInt).
     * This is the primary submitter reference used for display (fullName, username).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member user; // The member who submitted the complaint

    /**
     * Links to the users table via user_id (UUID).
     * Required by the legacy DB schema NOT NULL constraint.
     * Populated automatically in @PrePersist/@PreUpdate by resolving from the Member's username.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User submitterUser;

    @Column(nullable = false)
    private String subject;

    // "content" is the canonical field used by the application.
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    // "body" is the legacy DB column — kept in sync via @PrePersist/@PreUpdate.
    @Column(name = "body", nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(nullable = false)
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED

    @Column(columnDefinition = "TEXT")
    private String response;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    private OffsetDateTime respondedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responded_by_id")
    private User respondedBy;

    private String category; // e.g., 'Maintenance', 'Security', 'Sanitation'
    private String urgency;  // e.g., 'Low', 'Medium', 'High'

    /**
     * "Double Mapping" sync strategy.
     * Ensures legacy DB constraints are satisfied before every INSERT or UPDATE.
     * - body mirrors content (legacy column alias)
     */
    @PrePersist
    @PreUpdate
    public void syncLegacyColumns() {
        // Sync content → body
        if (this.content != null) {
            this.body = this.content;
        }
    }
}
