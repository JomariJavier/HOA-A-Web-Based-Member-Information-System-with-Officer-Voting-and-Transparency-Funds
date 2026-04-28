package com.hoa.backend.dashboard;

import com.hoa.backend.member.MemberRepository;
import com.hoa.backend.voting.ElectionRepository;
import com.hoa.backend.audit.AuditRecord;
import com.hoa.backend.audit.AuditRecordRepository;
import com.hoa.backend.audit.ProjectRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private MemberRepository memberRepository;
    @Autowired private ElectionRepository electionRepository;
    @Autowired private AuditRecordRepository auditRecordRepository;
    @Autowired private ProjectRepository projectRepository;

    @PostConstruct
    public void seedData() {
        // Removed hardcoded seed data to ensure a clean production-ready state.
        // Data should be added via the UI or external database migration.
    }

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalMembers", memberRepository.count());
        stats.put("activeElections", electionRepository.count());
        
        List<AuditRecord> records = auditRecordRepository.findAll().stream()
                .filter(r -> !r.isDeleted())
                .collect(Collectors.toList());
                
        BigDecimal totalIncome = records.stream()
                .filter(r -> "INCOME".equalsIgnoreCase(r.getType()))
                .map(AuditRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalExpense = records.stream()
                .filter(r -> "EXPENSE".equalsIgnoreCase(r.getType()))
                .map(AuditRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal balance = totalIncome.subtract(totalExpense);
        
        stats.put("totalFunds", balance);
        stats.put("ongoingProjects", projectRepository.countByStatus("ONGOING"));
        
        // Detailed lists for tables
        stats.put("recentTransactions", auditRecordRepository.findTop5ByOrderByDateDesc());
        stats.put("recentLogs", auditRecordRepository.findTop5ByOrderByDateDesc());
        
        return stats;
    }
}
