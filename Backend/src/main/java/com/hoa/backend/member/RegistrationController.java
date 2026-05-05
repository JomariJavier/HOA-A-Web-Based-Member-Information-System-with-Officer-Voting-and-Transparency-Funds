package com.hoa.backend.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Public-facing registration controller.
 * Allows prospective HOA members to submit a sign-up request.
 * Applications are saved with status = "Pending" for officer review.
 */
@RestController
@RequestMapping("/api/public")
public class RegistrationController {

    @Autowired
    private MemberRepository memberRepository;

    @PostMapping("/register")
    public ResponseEntity<?> submitRegistration(@RequestBody Member application) {
        try {
            // Check for duplicate username
            if (application.getUsername() != null &&
                    memberRepository.existsByUsername(application.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Username is already taken. Please choose another."));
            }

            // Mark as pending — officer must approve before account is activated
            application.setStatus("Pending");
            application.setRole("Member");

            Member saved = memberRepository.save(application);
            return ResponseEntity.ok(Map.of(
                    "message", "Registration submitted successfully! An officer will review your application.",
                    "id", saved.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Could not process registration. Please try again later."));
        }
    }
}
