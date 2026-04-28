package com.hoa.backend.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    public Member saveMember(Member member) {
        return memberRepository.save(member);
    }

    /**
     * Soft delete: Instead of removing the record from the DB,
     * we set the status to 'Inactive'.
     */
    public void deleteMember(Long id) {
        memberRepository.findById(id).ifPresent(member -> {
            member.setStatus("Inactive");
            memberRepository.save(member);
        });
    }
}
