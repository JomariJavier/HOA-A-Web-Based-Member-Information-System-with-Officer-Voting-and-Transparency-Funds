package com.hoa.backend.audit;

import jakarta.persistence.*;

@Entity
@Table(name = "community_projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "status")
    private String status; // ONGOING, COMPLETED, PLANNED

    @Column(name = "progress")
    private int progress;

    @Column(name = "budget")
    private String budget;

    @Column(name = "timeline")
    private String timeline;

    public Project() {}

    public Project(String name, String status, int progress, String budget, String timeline) {
        this.name = name;
        this.status = status;
        this.progress = progress;
        this.budget = budget;
        this.timeline = timeline;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }
    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }
}
