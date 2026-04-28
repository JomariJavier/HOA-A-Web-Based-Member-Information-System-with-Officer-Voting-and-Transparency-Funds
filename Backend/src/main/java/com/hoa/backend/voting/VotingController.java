package com.hoa.backend.voting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.hoa.backend.member.MemberRepository;
import com.hoa.backend.member.Member;
import com.hoa.backend.auth.UserRepository;
import com.hoa.backend.auth.User;
import jakarta.transaction.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/voting/elections")
public class VotingController {

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private VoteTrackerRepository voteTrackerRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.hoa.backend.audit.AuditLogService auditLogService;

    @GetMapping
    public List<Election> getAllElections(Authentication authentication) {
        List<Election> elections = electionRepository.findAll();
        
        // If user is logged in, check which elections they've voted in
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            memberRepository.findByUsername(username).ifPresent(member -> {
                for (Election e : elections) {
                    boolean hasVoted = voteTrackerRepository.existsByMemberIdAndElectionId(member.getId(), e.getId());
                    e.setUserHasVoted(hasVoted);
                }
            });
        }
        
        return elections;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Election> getElectionById(@PathVariable Long id) {
        return electionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createElection(@RequestBody Election election, Authentication auth) {
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

        Election saved = electionRepository.save(election);
        User admin = userRepository.findByUsername(auth.getName()).orElse(null);
        auditLogService.logAction(admin, "ELECTION_CREATED", "Title: " + saved.getTitle() + " | Nominees: " + saved.getNominees().size());
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{electionId}/candidates/{candidateId}/vote")
    @Transactional
    public ResponseEntity<?> vote(@PathVariable Long electionId, 
                                  @PathVariable Long candidateId,
                                  Authentication authentication) {
        
        // 0. Secure Identity Lookup
        String username = authentication.getName();
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Logged in user is not registered as a member."));
        Long memberId = member.getId();
        
        // 1. Check one-vote-per-person constraint using VoteTracker (WHO voted)
        if (voteTrackerRepository.existsByMemberIdAndElectionId(memberId, electionId)) {
            return ResponseEntity.badRequest().body("Member has already voted in this election.");
        }

        // 2. Validate candidate belongs to election
        return candidateRepository.findById(candidateId).map(candidate -> {
            Election election = candidate.getElection();
            
            if (!election.getId().equals(electionId)) {
                return ResponseEntity.badRequest().body("Candidate does not belong to this election.");
            }

            // 3. Security Check: Block voting in concluded elections
            if (OffsetDateTime.now().isAfter(election.getEndDate())) {
                return ResponseEntity.badRequest().body("Voting has concluded for this election.");
            }

            // Record WHO voted (to prevent double voting)
            voteTrackerRepository.save(new VoteTracker(memberId, electionId));

            // Record WHAT was voted (anonymously)
            voteRepository.save(new Vote(electionId, candidateId));

            // Atomic increment for display purposes
            candidateRepository.incrementVoteCount(candidateId);
            
            User user = userRepository.findByUsername(username).orElse(null);
            auditLogService.logAction(user, "VOTE_CAST", "Voted in election ID: " + electionId + " for candidate ID: " + candidateId);
            
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats/member-count")
    public ResponseEntity<Long> getTotalMembersCount() {
        return ResponseEntity.ok(memberRepository.count());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<Void> deleteElection(@PathVariable Long id, Authentication authentication) {
        if (!electionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Cleanup vote trackers and anonymous votes
        voteTrackerRepository.deleteAll(
            voteTrackerRepository.findAll().stream()
                .filter(v -> v.getElectionId().equals(id))
                .toList()
        );
        voteRepository.deleteByElectionId(id);

        electionRepository.deleteById(id);
        User admin = userRepository.findByUsername(authentication.getName()).orElse(null);
        auditLogService.logAction(admin, "ELECTION_DELETED", "Deleted election ID: " + id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<?> getElectionResults(@PathVariable Long id) {
        return electionRepository.findById(id).map(election -> {
            Candidate winner = election.getNominees().stream()
                    .max(java.util.Comparator.comparing(Candidate::getVoteCount))
                    .orElse(null);
            
            long totalVotes = election.getNominees().stream()
                    .mapToLong(Candidate::getVoteCount)
                    .sum();

            return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
                put("electionTitle", election.getTitle());
                put("totalVotes", totalVotes);
                put("winner", winner != null ? winner.getName() : "N/A");
                put("candidates", election.getNominees());
            }});
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/emergency-reset")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<Void> clearAllElections(Authentication authentication) {
        voteTrackerRepository.deleteAll();
        voteRepository.deleteAll();
        candidateRepository.deleteAll();
        electionRepository.deleteAll();
        
        User admin = userRepository.findByUsername(authentication.getName()).orElse(null);
        auditLogService.logAction(admin, "EMERGENCY_RESET", "All election data cleared.");
        
        return ResponseEntity.noContent().build();
    }
}
