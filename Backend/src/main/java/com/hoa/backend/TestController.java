package com.hoa.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import main.java.com.hoa.backend.MemberRepository;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @Autowired
    private MemberRepository memberRepository;

    // GET: Fetch all members from the database
    @GetMapping
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // POST: Save a new member to the database
    @PostMapping
    public Member createMember(@RequestBody Member member) {
        // Set a default status if none provided
        if (member.getStatus() == null) {
            member.setStatus("Active");
        }
        return memberRepository.save(member);
    }
    // Inside TestController.java
    @GetMapping("/test")
    public String apiCheck() {
        return "Member API is Live and Reachable!";
    }
}