package com.hoa.backend.publicrelations;

import com.hoa.backend.auth.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "announcements")
@Data
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    @CreationTimestamp
    @Column(name = "published_at", updatable = false)
    private OffsetDateTime publishedAt;

    @org.hibernate.annotations.UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "pinned")
    private boolean pinned = false;

    @Column(name = "archived")
    private boolean archived = false;

    @Column(name = "is_pinned")
    private boolean isPinned = false;

    @Column(name = "is_archived")
    private boolean isArchived = false;

    @PrePersist
    @PreUpdate
    public void syncBooleans() {
        this.isPinned = this.pinned;
        this.isArchived = this.archived;
    }

    @Column(name = "category")
    private String category; // e.g., 'Maintenance', 'Security', 'Events'

    @Column(name = "image_url")
    private String imageUrl; // Optional header image
}
