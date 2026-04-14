package com.hoa.backend.voting;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "elections")
public class Election {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
    
    private String status;

    @OneToMany(mappedBy = "election", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Candidate> nominees = new ArrayList<>();

    public Election() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Candidate> getNominees() { return nominees; }
    public void setNominees(List<Candidate> nominees) { 
        this.nominees = nominees; 
        for(Candidate c : nominees) {
            c.setElection(this);
        }
    }
    
    public void addNominee(Candidate candidate) {
        nominees.add(candidate);
        candidate.setElection(this);
    }
}
