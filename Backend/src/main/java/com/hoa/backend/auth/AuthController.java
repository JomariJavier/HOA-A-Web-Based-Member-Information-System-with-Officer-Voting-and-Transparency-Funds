package com.hoa.backend.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import com.hoa.backend.audit.AuditLogService;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuditLogService auditLogService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");
            User user = authService.registerMember(username, password);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        try {
            String username = request.get("username");
            String password = request.get("password");
            User user = authService.authenticate(username, password);

            // MANUALLY SET SECURITY CONTEXT FOR SPRING SECURITY
            UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(
                    user.getUsername(), 
                    null, 
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
            );
            
            SecurityContext sc = SecurityContextHolder.getContext();
            sc.setAuthentication(authReq);
            
            // Persist the context in the session
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);

            auditLogService.logAction(user, "LOGIN", "Successful login from IP: " + httpRequest.getRemoteAddr());

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
