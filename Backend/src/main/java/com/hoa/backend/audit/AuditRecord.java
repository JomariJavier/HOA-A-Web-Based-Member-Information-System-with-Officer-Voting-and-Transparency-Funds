package com.hoa.backend.audit;

import com.hoa.backend.auth.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_records")
public class AuditRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    private String type; // INCOME, EXPENSE
    private String category;
    private String description;
    private LocalDateTime date;
    private boolean isDeleted = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User recordedBy;

    public AuditRecord() {
        this.date = LocalDateTime.now();
    }

    public AuditRecord(BigDecimal amount, String type, String category, String description, User recordedBy) {
        this.amount = amount;
        this.type = type;
        this.category = category;
        this.description = description;
        this.recordedBy = recordedBy;
        this.date = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }
    public User getRecordedBy() { return recordedBy; }
    public void setRecordedBy(User recordedBy) { this.recordedBy = recordedBy; }
}
