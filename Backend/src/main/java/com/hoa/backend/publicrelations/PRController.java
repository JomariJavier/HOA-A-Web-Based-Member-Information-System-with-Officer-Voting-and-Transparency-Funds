package com.hoa.backend.publicrelations;

import com.hoa.backend.auth.User;
import com.hoa.backend.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.hoa.backend.audit.AuditLogService;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pr")
public class PRController {

    @Autowired private AnnouncementRepository announcementRepository;
    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AuditLogService auditLogService;

    // --- ANNOUNCEMENTS ---

    @GetMapping("/announcements")
    public List<Announcement> getAnnouncements() {
        return announcementRepository.findAllByIsArchivedFalseOrderByIsPinnedDescPublishedAtDesc();
    }

    @PostMapping("/announcements")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public Announcement createAnnouncement(@RequestBody Announcement announcement, Authentication auth) {
        User author = userRepository.findByUsername(auth.getName()).orElseThrow();
        announcement.setAuthor(author);
        Announcement saved = announcementRepository.save(announcement);
        auditLogService.logAction(author, "ANNOUNCEMENT_CREATED", "Title: " + saved.getTitle());
        return saved;
    }

    // --- COMPLAINTS ---

    @GetMapping("/complaints")
    public List<Complaint> getComplaints(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        
        if (user.getRole().equals("ADMIN") || user.getRole().equals("SUPERADMIN")) {
            return complaintRepository.findAllByOrderByCreatedAtDesc();
        } else {
            return complaintRepository.findAllByUserOrderByCreatedAtDesc(user);
        }
    }

    @PostMapping("/complaints")
    @PreAuthorize("hasRole('MEMBER')")
    public Complaint submitComplaint(@RequestBody Complaint complaint, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        
        complaint.setUser(user);
        complaint.setStatus("OPEN");
        
        return complaintRepository.save(complaint);
    }

    @PatchMapping("/complaints/{id}/respond")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> respondToComplaint(@PathVariable Long id, @RequestBody Map<String, String> request, Authentication auth) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        User responder = userRepository.findByUsername(auth.getName()).orElseThrow();
        
        complaint.setResponse(request.get("response"));
        complaint.setStatus(request.getOrDefault("status", "RESOLVED"));
        complaint.setRespondedAt(OffsetDateTime.now());
        complaint.setRespondedBy(responder);
        
        Complaint saved = complaintRepository.save(complaint);
        auditLogService.logAction(responder, "COMPLAINT_RESPONDED", "Complaint ID: " + id + " | New Status: " + saved.getStatus());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/complaints/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<String> exportComplaints() {
        List<Complaint> complaints = complaintRepository.findAllByOrderByCreatedAtDesc();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Date,Member,Category,Urgency,Subject,Status,Response,Responded By\n");
        
        for (Complaint c : complaints) {
            csv.append(c.getId()).append(",")
               .append(c.getCreatedAt()).append(",")
               .append(c.getUser().getUsername()).append(",")
               .append(c.getCategory()).append(",")
               .append(c.getUrgency()).append(",")
               .append("\"").append(c.getSubject().replace("\"", "\"\"")).append("\",")
               .append(c.getStatus()).append(",")
               .append("\"").append(c.getResponse() != null ? c.getResponse().replace("\"", "\"\"") : "").append("\",")
               .append(c.getRespondedBy() != null ? c.getRespondedBy().getUsername() : "")
               .append("\n");
        }
        
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=complaints_report.csv")
                .header("Content-Type", "text/csv")
                .body(csv.toString());
    }
}
