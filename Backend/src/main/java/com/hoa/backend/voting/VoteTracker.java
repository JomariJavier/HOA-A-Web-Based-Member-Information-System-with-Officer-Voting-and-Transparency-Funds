package com.hoa.backend.voting;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "vote_tracker", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"member_id", "election_id"})
})
@Data
public class VoteTracker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "election_id", nullable = false)
    private Long electionId;

    @Column(name = "has_voted", nullable = false)
    private Boolean hasVoted = false;

    @CreationTimestamp
    @Column(name = "voted_at")
    private OffsetDateTime votedAt;

    public VoteTracker() {}

    public VoteTracker(Long memberId, Long electionId) {
        this.memberId = memberId;
        this.electionId = electionId;
        this.hasVoted = true;
    }
}
