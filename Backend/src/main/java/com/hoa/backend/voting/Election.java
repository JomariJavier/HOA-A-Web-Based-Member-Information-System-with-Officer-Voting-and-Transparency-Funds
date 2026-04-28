package com.hoa.backend.voting;

import com.hoa.backend.auth.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "elections")
@Data
public class Election {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
    
    private String description;

    @Column(name = "start_date", nullable = false)
    private OffsetDateTime startDate;
    
    @Column(name = "end_date", nullable = false)
    private OffsetDateTime endDate;
    
    @Column(nullable = false, length = 20)
    private String status = "UPCOMING"; // UPCOMING, ACTIVE, CLOSED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "election", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Candidate> nominees = new ArrayList<>();

    @Transient
    private boolean userHasVoted;

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
