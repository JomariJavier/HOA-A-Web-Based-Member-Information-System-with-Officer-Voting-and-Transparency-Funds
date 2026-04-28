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

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    @CreationTimestamp
    private OffsetDateTime publishedAt;

    private boolean isPinned = false;
    private boolean isArchived = false;

    private String category; // e.g., 'Maintenance', 'Security', 'Events'
    private String imageUrl; // Optional header image
}
