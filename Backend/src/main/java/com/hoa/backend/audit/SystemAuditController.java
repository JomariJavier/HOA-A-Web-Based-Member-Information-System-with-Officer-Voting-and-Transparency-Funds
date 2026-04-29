package com.hoa.backend.audit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class SystemAuditController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public List<AuditLog> getLogs() {
        return auditLogService.getAllLogs();
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public org.springframework.http.ResponseEntity<String> exportLogs() {
        List<AuditLog> logs = auditLogService.getAllLogs();
        StringBuilder txt = new StringBuilder();
        txt.append("=========================================================\n");
        txt.append("                  SYSTEM AUDIT LOGS                      \n");
        txt.append("=========================================================\n\n");
        
        for (AuditLog log : logs) {
            String timestamp = log.getCreatedAt() != null ? log.getCreatedAt().toString() : "UNKNOWN_TIME";
            String user = log.getUser() != null ? log.getUser().getUsername() : "SYSTEM";
            txt.append(String.format("[%s] %s | %s | %s | IP: %s\n",
                    timestamp,
                    user,
                    log.getAction(),
                    log.getDetails(),
                    log.getIpAddress() != null ? log.getIpAddress() : "UNKNOWN"
            ));
        }
        
        return org.springframework.http.ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=system_audit_logs.txt")
                .header("Content-Type", "text/plain")
                .body(txt.toString());
    }
}
