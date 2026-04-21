package com.hoa.backend.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:5173") // Allow your Vite Frontend to access this
public class MemberController {

    @Autowired
    private MemberRepository memberRepository;

    // Fetch all members (for the Directory List)
    @GetMapping
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // Fetch one specific member (for the View Details page)
    @GetMapping("/{id}")
    public Member getMemberById(@PathVariable Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    // Save a new member (from the Registration form)
   @PostMapping
        public Member registerMember(@RequestBody Member member) { // @RequestBody is CRITICAL
        return memberRepository.save(member);
}
}