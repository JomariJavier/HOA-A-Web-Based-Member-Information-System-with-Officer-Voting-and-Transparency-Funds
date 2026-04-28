package com.hoa.backend.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.hoa.backend.auth.UserRepository;
import com.hoa.backend.auth.User;
import com.hoa.backend.audit.AuditLogService;
import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private UserRepository userRepository;

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

    // Save a new member
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Member registerMember(@RequestBody Member member, Authentication auth) {
        Member saved = memberService.saveMember(member);
        User admin = userRepository.findByUsername(auth.getName()).orElse(null);
        auditLogService.logAction(admin, "MEMBER_REGISTERED", "Registered member: " + saved.getFullName() + " (" + saved.getUsername() + ")");
        return saved;
    }

    // Update member details
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMember(@PathVariable Long id, Authentication auth) {
        memberService.deleteMember(id);
        User admin = userRepository.findByUsername(auth.getName()).orElse(null);
        auditLogService.logAction(admin, "MEMBER_DELETED", "Soft-deleted member ID: " + id);
    }
}