package com.hoa.backend.dashboard;

import com.hoa.backend.member.MemberRepository;
import com.hoa.backend.voting.ElectionRepository;
import com.hoa.backend.finance.Transaction;
import com.hoa.backend.finance.TransactionRepository;
import com.hoa.backend.audit.AuditRecord;
import com.hoa.backend.audit.AuditRecordRepository;
import com.hoa.backend.audit.Project;
import com.hoa.backend.audit.ProjectRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class DashboardService {

    @Autowired private MemberRepository memberRepository;
    @Autowired private ElectionRepository electionRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private AuditRecordRepository auditRecordRepository;
    @Autowired private ProjectRepository projectRepository;

    @PostConstruct
    public void seedData() {
        if (transactionRepository.count() == 0) {
            transactionRepository.save(new Transaction("Maintenance Collection", 20000.0, "INCOME"));
            transactionRepository.save(new Transaction("Street Light Repair", 5000.0, "EXPENSE"));
            transactionRepository.save(new Transaction("Security Guard Salary", 15000.0, "EXPENSE"));
        }
        if (auditRecordRepository.count() == 0) {
            auditRecordRepository.save(new AuditRecord("Juan Dela Cruz", "Voted for President"));
            auditRecordRepository.save(new AuditRecord("Admin", "Updated Funds Transparency"));
        }
        if (projectRepository.count() == 0) {
            projectRepository.save(new Project("Street Paving", "ONGOING", 65, "150000", "Jan - Jun 2024"));
            projectRepository.save(new Project("CCTV Installation", "ONGOING", 30, "80000", "Mar - May 2024"));
            projectRepository.save(new Project("Park Renovation", "PLANNED", 0, "200000", "Jul - Dec 2024"));
            projectRepository.save(new Project("Clubhouse Painting", "COMPLETED", 100, "45000", "Feb 2024"));
        }
    }

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalMembers", memberRepository.count());
        stats.put("activeElections", electionRepository.count());
        
        Double balance = transactionRepository.calculateTotalBalance();
        stats.put("totalFunds", balance != null ? balance : 0.0);
        
        stats.put("ongoingProjects", projectRepository.countByStatus("ONGOING"));
        
        // Detailed lists for tables
        stats.put("recentTransactions", transactionRepository.findTop5ByOrderByDateDesc());
        stats.put("recentLogs", auditRecordRepository.findTop5ByOrderByDateDesc());
        
        return stats;
    }
}
