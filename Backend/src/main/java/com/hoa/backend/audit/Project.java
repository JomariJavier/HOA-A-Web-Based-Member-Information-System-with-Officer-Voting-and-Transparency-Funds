package com.hoa.backend.audit;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "community_projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String status; // ONGOING, COMPLETED, PLANNED
    private int progress;

    @Column(precision = 15, scale = 2)
    private BigDecimal budget;

    private String timeline;
    private LocalDate startDate;

    public Project() {
        this.startDate = LocalDate.now();
    }

    public Project(String name, String description, String status, int progress, BigDecimal budget, String timeline) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.progress = progress;
        this.budget = budget;
        this.timeline = timeline;
        this.startDate = LocalDate.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }
    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
}
