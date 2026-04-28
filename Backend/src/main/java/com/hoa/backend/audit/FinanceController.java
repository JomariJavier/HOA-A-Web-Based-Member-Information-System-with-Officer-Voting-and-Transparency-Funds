package com.hoa.backend.audit;

import com.hoa.backend.auth.User;
import com.hoa.backend.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    @Autowired
    private FinanceService financeService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/records")
    public List<AuditRecord> getRecords() {
        return financeService.getAllActiveRecords();
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        return financeService.getFinancialSummary();
    }

    @PostMapping("/records")
    @PreAuthorize("hasRole('ADMIN')")
    public AuditRecord addRecord(@RequestBody AuditRecord record, Authentication authentication) {
        if (authentication != null) {
            userRepository.findByUsername(authentication.getName())
                    .ifPresent(record::setRecordedBy);
        }
        AuditRecord saved = financeService.saveRecord(record);
        
        if (authentication != null) {
            User admin = userRepository.findByUsername(authentication.getName()).orElse(null);
            auditLogService.logAction(admin, "FINANCE_RECORD_CREATED", "Type: " + saved.getType() + " | Amount: " + saved.getAmount());
        }
        
        return saved;
    }

    @DeleteMapping("/records/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id, Authentication authentication) {
        financeService.softDelete(id);
        User admin = userRepository.findByUsername(authentication.getName()).orElse(null);
        auditLogService.logAction(admin, "FINANCE_RECORD_DELETED", "Soft-deleted record ID: " + id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport() {
        String csvData = financeService.generateCsvReport();
        byte[] csvBytes = csvData.getBytes();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "finance_report.csv");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        
        return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
    }
}
