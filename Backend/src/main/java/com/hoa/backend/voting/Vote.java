package com.hoa.backend.voting;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "votes")
@Data
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "election_id", nullable = false)
    private Long electionId;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @CreationTimestamp
    @Column(name = "voted_at", nullable = false, updatable = false)
    private OffsetDateTime votedAt;

    public Vote() {}

    public Vote(Long electionId, Long candidateId) {
        this.electionId = electionId;
        this.candidateId = candidateId;
    }
}
