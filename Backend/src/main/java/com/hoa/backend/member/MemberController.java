package com.hoa.backend.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.hoa.backend.auth.User;
import com.hoa.backend.auth.UserRepository;
import com.hoa.backend.audit.AuditLogService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditLogService auditLogService;

    // Fetch all members
    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // Fetch one specific member
    @GetMapping("/{id}")
    public Member getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    // Save a new member (admin-created, immediately Active)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<?> registerMember(@RequestBody Member member, Authentication auth) {
        // Admin-created members skip the Pending step — they're immediately Active
        if (member.getStatus() == null || member.getStatus().isBlank()) {
            member.setStatus("Active");
        }

        // If the admin provided a username + password, create the User account now
        if (member.getUsername() != null && !member.getUsername().isBlank()
                && member.getPassword() != null && !member.getPassword().isBlank()) {

            if (userRepository.existsByUsername(member.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Username '" + member.getUsername() + "' is already taken."));
            }

            User user = new User();
            user.setUsername(member.getUsername());
            user.setPasswordHash(passwordEncoder.encode(member.getPassword()));
            user.setRole("MEMBER");
            user.setStatus("ACTIVE");
            userRepository.save(user);
        }

        // Clear the plain-text password before persisting to members table
        member.setPassword(null);

        Member saved = memberService.saveMember(member);
        User admin = userRepository.findByUsername(auth.getName()).orElse(null);
        auditLogService.logAction(admin, "MEMBER_REGISTERED",
                "Registered member: " + saved.getFullName() + " (" + saved.getUsername() + ")");
        return ResponseEntity.ok(saved);
    }

    /**
     * Activate a pending member application.
     * - Sets members.status = "Active"
     * - Creates a User row so the member can log in using the password
     *   they chose during public registration.
     */
    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<?> activateMember(@PathVariable Long id, Authentication auth) {
        Member member = memberService.getMemberById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (member.getUsername() == null || member.getUsername().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "This member has no username set. Please edit their profile first."));
        }

        // Create the User login account if it doesn't already exist
        if (!userRepository.existsByUsername(member.getUsername())) {
            if (member.getPassword() == null || member.getPassword().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "No password on file for this member. They must register via the public form first."));
            }
            User user = new User();
            user.setUsername(member.getUsername());
            // Password is already BCrypt-hashed from RegistrationController
            user.setPasswordHash(member.getPassword());
            user.setRole("MEMBER");
            user.setStatus("ACTIVE");
            userRepository.save(user);
        } else {
            // User exists — just make sure they're marked ACTIVE
            User existing = userRepository.findByUsername(member.getUsername()).get();
            existing.setStatus("ACTIVE");
            userRepository.save(existing);
        }

        // Update member record status
        member.setStatus("Active");
        Member saved = memberService.saveMember(member);

        User admin = userRepository.findByUsername(auth.getName()).orElse(null);
        auditLogService.logAction(admin, "MEMBER_ACTIVATED",
                "Activated member account: " + saved.getFullName() + " (" + saved.getUsername() + ")");

        return ResponseEntity.ok(saved);
    }

    /**
     * Deactivate a member.
     * - Sets members.status = "Inactive"
     * - Marks User.status = "INACTIVE" to block future logins
     */
    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<?> deactivateMember(@PathVariable Long id, Authentication auth) {
        Member member = memberService.getMemberById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // Disable the login account
        if (member.getUsername() != null) {
            userRepository.findByUsername(member.getUsername()).ifPresent(user -> {
                user.setStatus("INACTIVE");
                userRepository.save(user);
            });
        }

        member.setStatus("Inactive");
        Member saved = memberService.saveMember(member);

        User admin = userRepository.findByUsername(auth.getName()).orElse(null);
        auditLogService.logAction(admin, "MEMBER_DEACTIVATED",
                "Deactivated member account: " + saved.getFullName());

        return ResponseEntity.ok(saved);
    }

    // Update member details
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public Member updateMember(@PathVariable Long id, @RequestBody Member memberDetails, Authentication auth) {
        Member member = memberService.getMemberById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.setFullName(memberDetails.getFullName());
        member.setBirthDate(memberDetails.getBirthDate());
        member.setHoaAddress(memberDetails.getHoaAddress());
        member.setRole(memberDetails.getRole());
        member.setStatus(memberDetails.getStatus());
        member.setFamilyMembers(memberDetails.getFamilyMembers());
        member.setEmail(memberDetails.getEmail());
        member.setContactNumber(memberDetails.getContactNumber());

        Member saved = memberService.saveMember(member);
        User admin = userRepository.findByUsername(auth.getName()).orElse(null);
        auditLogService.logAction(admin, "MEMBER_UPDATED", "Updated details for: " + saved.getFullName());
        return saved;
    }

    // Soft delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public void deleteMember(@PathVariable Long id, Authentication auth) {
        memberService.deleteMember(id);
        User admin = userRepository.findByUsername(auth.getName()).orElse(null);
        auditLogService.logAction(admin, "MEMBER_DELETED", "Soft-deleted member ID: " + id);
    }
}