package com.hoa.backend.voting;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vote_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"member_id", "election_id"})
})
public class VoteRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "election_id", nullable = false)
    private Long electionId;

    private LocalDateTime votedAt;

    public VoteRecord() {}

    public VoteRecord(Long memberId, Long electionId) {
        this.memberId = memberId;
        this.electionId = electionId;
        this.votedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public Long getElectionId() { return electionId; }
    public void setElectionId(Long electionId) { this.electionId = electionId; }

    public LocalDateTime getVotedAt() { return votedAt; }
    public void setVotedAt(LocalDateTime votedAt) { this.votedAt = votedAt; }
}
