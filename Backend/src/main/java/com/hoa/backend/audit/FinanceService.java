package com.hoa.backend.audit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class FinanceService {

    @Autowired
    private AuditRecordRepository auditRecordRepository;

    public List<AuditRecord> getAllActiveRecords() {
        return auditRecordRepository.findAll().stream()
                .filter(record -> !record.isDeleted())
                .collect(Collectors.toList());
    }

    public AuditRecord saveRecord(AuditRecord record) {
        return auditRecordRepository.save(record);
    }

    public void softDelete(Long id) {
        auditRecordRepository.findById(id).ifPresent(record -> {
            record.setDeleted(true);
            auditRecordRepository.save(record);
        });
    }

    public Map<String, Object> getFinancialSummary() {
        List<AuditRecord> records = getAllActiveRecords();
        
        BigDecimal totalIncome = records.stream()
                .filter(r -> "INCOME".equalsIgnoreCase(r.getType()))
                .map(AuditRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalExpense = records.stream()
                .filter(r -> "EXPENSE".equalsIgnoreCase(r.getType()))
                .map(AuditRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal balance = totalIncome.subtract(totalExpense);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("communityBalance", balance);
        summary.put("recordCount", records.size());
        
        return summary;
    }

    public String generateCsvReport() {
        List<AuditRecord> records = getAllActiveRecords();
        StringBuilder csv = new StringBuilder();
        csv.append("Date,Type,Category,Description,Amount,Recorded By\n");
        
        for (AuditRecord r : records) {
            csv.append(r.getDate()).append(",")
               .append(r.getType()).append(",")
               .append(r.getCategory()).append(",")
               .append("\"").append(r.getDescription()).append("\",")
               .append(r.getAmount()).append(",")
               .append(r.getRecordedBy() != null ? r.getRecordedBy().getUsername() : "System")
               .append("\n");
        }
        return csv.toString();
    }
}
