package com.hoa.backend.member;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "members")
@Data 
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    
    @Column(unique = true)
    private String username;
    
    private LocalDate birthDate;
    private String hoaAddress;
    private LocalDate dateRegistered;
    private String maritalStatus;
    private String gender;
    
    @Email
    private String email;
    
    private String contactNumber;
    
    @Column(columnDefinition = "TEXT") // Allows for longer entries
    private String familyMembers;
    
    private String role; // 'Officer', 'Member'
    private String status; // 'Active', 'Inactive'

    // Automatically set the registration date when a record is first created
    @PrePersist
    protected void onCreate() {
        this.dateRegistered = LocalDate.now();
        if (this.status == null) this.status = "Active";
    }
}