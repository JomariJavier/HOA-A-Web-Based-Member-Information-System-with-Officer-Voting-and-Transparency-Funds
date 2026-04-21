package com.hoa.backend.voting;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    
    @Modifying
    @Transactional
    @Query("UPDATE Candidate c SET c.voteCount = c.voteCount + 1 WHERE c.id = :candidateId")
    void incrementVoteCount(Long candidateId);
}
