package com.hoa.backend.voting;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteRecordRepository extends JpaRepository<VoteRecord, Long> {
    boolean existsByMemberIdAndElectionId(Long memberId, Long electionId);
}
