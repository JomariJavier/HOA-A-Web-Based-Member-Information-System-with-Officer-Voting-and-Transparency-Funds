package com.hoa.backend.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    @Autowired
    private MemberRepository memberRepository;

    // Fetch all members
    @GetMapping
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // Fetch one specific member
    @GetMapping("/{id}")
    public Member getMemberById(@PathVariable Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    // Save a new member
    @PostMapping
    public Member registerMember(@RequestBody Member member) {
        if (member.getRole() == null) {
            member.setRole("Member");
        }
        if (member.getStatus() == null) {
            member.setStatus("Active");
        }
        return memberRepository.save(member);
    }

    // Update member details (including status/deactivation)
    @PutMapping("/{id}")
    public Member updateMember(@PathVariable Long id, @RequestBody Member memberDetails) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.setFullName(memberDetails.getFullName());
        member.setBirthDate(memberDetails.getBirthDate());
        member.setHoaAddress(memberDetails.getHoaAddress());
        member.setRole(memberDetails.getRole());
        member.setStatus(memberDetails.getStatus());
        member.setFamilyMembers(memberDetails.getFamilyMembers());

        return memberRepository.save(member);
    }
}