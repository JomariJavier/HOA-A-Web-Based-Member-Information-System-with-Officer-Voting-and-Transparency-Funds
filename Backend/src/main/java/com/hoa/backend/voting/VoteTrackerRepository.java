package com.hoa.backend.voting;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteTrackerRepository extends JpaRepository<VoteTracker, Long> {
    boolean existsByMemberIdAndElectionId(Long memberId, Long electionId);
}
