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
}
