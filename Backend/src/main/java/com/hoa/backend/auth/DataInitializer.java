package com.hoa.backend.auth;

import com.hoa.backend.member.Member;
import com.hoa.backend.member.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        // 1. Seed Superadmin Account
        if (!userRepository.existsByUsername("superadmin")) {
            User superadmin = new User();
            superadmin.setUsername("superadmin");
            superadmin.setPasswordHash(passwordEncoder.encode("superadmin123"));
            superadmin.setRole("SUPERADMIN");
            superadmin.setStatus("ACTIVE");
            userRepository.save(superadmin);
            System.out.println("SEED: Created default superadmin account (superadmin / superadmin123)");
        }

        // 2. Seed Admin Account
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE");
            userRepository.save(admin);
            System.out.println("SEED: Created default admin account (admin / admin123)");
        }

        // 3. Seed Member Account
        if (!userRepository.existsByUsername("member")) {
            User memberUser = new User();
            memberUser.setUsername("member");
            memberUser.setPasswordHash(passwordEncoder.encode("member123"));
            memberUser.setRole("MEMBER");
            memberUser.setStatus("ACTIVE");
            userRepository.save(memberUser);
            
            // Seed corresponding Member record
            Member memberDetails = new Member();
            memberDetails.setFullName("John Member");
            memberDetails.setUsername("member");
            memberDetails.setRole("Member");
            memberDetails.setStatus("Active");
            memberRepository.save(memberDetails);
            
            System.out.println("SEED: Created default member account (member / member123)");
        }

        // 4. Seed Member record for 'member' user (if not exists)
        if (memberRepository.findByUsername("member").isEmpty()) {
            Member memberDetails = new Member();
            memberDetails.setFullName("John Member");
            memberDetails.setUsername("member");
            memberDetails.setRole("Member");
            memberDetails.setStatus("Active");
            memberRepository.save(memberDetails);
            System.out.println("SEED: Created missing Member record for 'member' user");
        }

        // 5. Seed Admin Member record (if not exists)
        if (memberRepository.findByUsername("admin").isEmpty()) {
            Member adminMember = new Member();
            adminMember.setFullName("System Administrator");
            adminMember.setUsername("admin");
            adminMember.setRole("Officer");
            adminMember.setStatus("Active");
            memberRepository.save(adminMember);
            System.out.println("SEED: Created missing Member record for 'admin' user");
        }

        // 6. Seed Superadmin Member record (if not exists)
        if (memberRepository.findByUsername("superadmin").isEmpty()) {
            Member saMember = new Member();
            saMember.setFullName("Grand Administrator");
            saMember.setUsername("superadmin");
            saMember.setRole("Officer");
            saMember.setStatus("Active");
            memberRepository.save(saMember);
            System.out.println("SEED: Created missing Member record for 'superadmin' user");
        }
    }
}
