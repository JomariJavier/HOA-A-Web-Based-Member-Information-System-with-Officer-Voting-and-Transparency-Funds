package com.hoa.backend.audit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        try {
            Project project = projectRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Project not found with ID: " + id));
            
            project.setName(projectDetails.getName());
            project.setStatus(projectDetails.getStatus());
            project.setProgress(projectDetails.getProgress());
            project.setBudget(projectDetails.getBudget());
            project.setTimeline(projectDetails.getTimeline());
            
            return projectRepository.save(project);
        } catch (Exception e) {
            System.err.println("Error updating project: " + e.getMessage());
            throw new RuntimeException("Update failed: " + e.getMessage());
        }
    }
}
