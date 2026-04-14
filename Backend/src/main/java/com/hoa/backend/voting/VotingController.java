package com.hoa.backend.voting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voting/elections")
@CrossOrigin(origins = "*") // For development purposes
public class VotingController {

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private CandidateRepository candidateRepository;

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
    public Election createElection(@RequestBody Election election) {
        if (election.getNominees() != null) {
            for (Candidate c : election.getNominees()) {
                c.setElection(election);
            }
        }
        return electionRepository.save(election);
    }

    @PostMapping("/{electionId}/candidates/{candidateId}/vote")
    public ResponseEntity<?> vote(@PathVariable Long electionId, @PathVariable Long candidateId) {
        return candidateRepository.findById(candidateId).map(candidate -> {
            if (!candidate.getElection().getId().equals(electionId)) {
                return ResponseEntity.badRequest().body("Candidate does not belong to this election");
            }
            candidate.setVoteCount(candidate.getVoteCount() + 1);
            candidateRepository.save(candidate);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
