package com.hoa.backend.voting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hoa.backend.member.MemberRepository;

import java.util.List;

@RestController
@RequestMapping("/api/voting/elections")
@CrossOrigin(origins = "*") // For development purposes
public class VotingController {

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private VoteRecordRepository voteRecordRepository;

    @Autowired
    private MemberRepository memberRepository;

    @GetMapping
    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Election> getElectionById(@PathVariable Long id) {
        return electionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createElection(@RequestBody Election election) {
        // Validation Logic
        if (election.getTitle() == null || election.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Election title is required.");
        }
        if (election.getStartDate() == null || election.getEndDate() == null) {
            return ResponseEntity.badRequest().body("Start and End dates are required.");
        }
        if (election.getEndDate().isBefore(election.getStartDate())) {
            return ResponseEntity.badRequest().body("End date cannot be before Start date.");
        }
        if (election.getNominees() == null || election.getNominees().size() < 2) {
            return ResponseEntity.badRequest().body("At least 2 nominees are required per election.");
        }

        for (Candidate c : election.getNominees()) {
            if (c.getName() == null || c.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("All nominees must have a name.");
            }
            c.setElection(election);
        }

        return ResponseEntity.ok(electionRepository.save(election));
    }

    @PostMapping("/{electionId}/candidates/{candidateId}/vote")
    public ResponseEntity<?> vote(@PathVariable Long electionId, 
                                  @PathVariable Long candidateId,
                                  @RequestParam Long memberId) {
        
        // 1. Check one-vote-per-person constraint
        if (voteRecordRepository.existsByMemberIdAndElectionId(memberId, electionId)) {
            return ResponseEntity.badRequest().body("Member has already voted in this election.");
        }

        // 2. Validate candidate belongs to election and atomic increment
        return candidateRepository.findById(candidateId).map(candidate -> {
            Election election = candidate.getElection();
            
            if (!election.getId().equals(electionId)) {
                return ResponseEntity.badRequest().body("Candidate does not belong to this election.");
            }

            // 3. Security Check: Block voting in concluded elections
            if (java.time.LocalDateTime.now().isAfter(election.getEndDate())) {
                return ResponseEntity.badRequest().body("Voting has concluded for this election.");
            }

            // Atomic increment prevents race conditions
            candidateRepository.incrementVoteCount(candidateId);
            
            // Record the vote
            voteRecordRepository.save(new VoteRecord(memberId, electionId));
            
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats/member-count")
    public ResponseEntity<Long> getTotalMembersCount() {
        return ResponseEntity.ok(memberRepository.count());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElection(@PathVariable Long id) {
        if (!electionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Manual cleanup of vote records for this election
        // (Since no explicit @OneToMany link exists in the Java model)
        voteRecordRepository.deleteAll(
            voteRecordRepository.findAll().stream()
                .filter(v -> v.getElectionId().equals(id))
                .toList()
        );

        electionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/emergency-reset")
    public ResponseEntity<Void> clearAllElections() {
        voteRecordRepository.deleteAll();
        candidateRepository.deleteAll();
        electionRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }
}
