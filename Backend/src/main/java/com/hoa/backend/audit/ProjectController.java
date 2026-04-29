package com.hoa.backend.audit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private FinanceService financeService;

    @Autowired
    private com.hoa.backend.auth.UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Project createProject(@RequestBody Project project, org.springframework.security.core.Authentication auth) {
        Project saved = projectRepository.save(project);
        
        // Automatically create a financial expense record if there's a budget
        if (saved.getBudget() != null && saved.getBudget().compareTo(java.math.BigDecimal.ZERO) > 0) {
            AuditRecord record = new AuditRecord();
            record.setAmount(saved.getBudget());
            record.setType("EXPENSE");
            record.setCategory("Project");
            record.setDescription("Initial budget allocation for project: " + saved.getName());
            
            if (auth != null) {
                userRepository.findByUsername(auth.getName()).ifPresent(record::setRecordedBy);
            }
            financeService.saveRecord(record);
        }

        if (auth != null) {
            com.hoa.backend.auth.User admin = userRepository.findByUsername(auth.getName()).orElse(null);
            auditLogService.logAction(admin, "PROJECT_CREATED", "Project Name: " + saved.getName() + " | Budget: " + saved.getBudget());
        }

        return saved;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project projectDetails, org.springframework.security.core.Authentication auth) {
        return projectRepository.findById(id).map(project -> {
            project.setName(projectDetails.getName());
            project.setDescription(projectDetails.getDescription());
            project.setStatus(projectDetails.getStatus());
            project.setProgress(projectDetails.getProgress());
            project.setBudget(projectDetails.getBudget());
            project.setTimeline(projectDetails.getTimeline());
            Project updated = projectRepository.save(project);

            if (auth != null) {
                com.hoa.backend.auth.User admin = userRepository.findByUsername(auth.getName()).orElse(null);
                auditLogService.logAction(admin, "PROJECT_UPDATED", "Project ID: " + id + " | Progress: " + updated.getProgress() + "%");
            }

            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, org.springframework.security.core.Authentication auth) {
        projectRepository.findById(id).ifPresent(p -> {
            projectRepository.deleteById(id);
            if (auth != null) {
                com.hoa.backend.auth.User admin = userRepository.findByUsername(auth.getName()).orElse(null);
                auditLogService.logAction(admin, "PROJECT_DELETED", "Deleted project: " + p.getName());
            }
        });
        return ResponseEntity.noContent().build();
    }
}
