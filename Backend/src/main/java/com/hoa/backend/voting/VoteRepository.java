package com.hoa.backend.voting;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    List<Vote> findByElectionId(Long electionId);
    List<Vote> findByCandidateId(Long candidateId);
    void deleteByElectionId(Long electionId);
}
